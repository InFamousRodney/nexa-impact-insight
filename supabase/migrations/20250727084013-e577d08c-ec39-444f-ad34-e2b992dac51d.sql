-- Create user role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'contributor', 'viewer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  org_id TEXT UNIQUE NOT NULL,
  org_name TEXT NOT NULL,
  instance_url TEXT NOT NULL,
  org_type TEXT NOT NULL CHECK (org_type IN ('Production', 'Sandbox', 'Developer')),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT NOT NULL DEFAULT 'disconnected' CHECK (sync_status IN ('connected', 'syncing', 'error', 'disconnected')),
  org_info JSONB,
  health_score INTEGER DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create metadata table
CREATE TABLE public.metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  metadata_type TEXT NOT NULL CHECK (metadata_type IN ('CustomObject', 'CustomField', 'Flow', 'ApexClass', 'Trigger', 'Layout', 'PermissionSet')),
  name TEXT NOT NULL,
  api_name TEXT NOT NULL,
  description TEXT,
  metadata_details JSONB,
  dependencies JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (organization_id, metadata_type, api_name)
);

-- Create documentation table
CREATE TABLE public.documentation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('overview', 'process', 'technical', 'user_guide')),
  metadata_refs JSONB,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table for AI assistant
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for organizations
CREATE POLICY "Users can view their own organizations" ON public.organizations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own organizations" ON public.organizations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all organizations" ON public.organizations
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for metadata
CREATE POLICY "Users can view metadata of their organizations" ON public.metadata
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organizations 
      WHERE id = metadata.organization_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage metadata of their organizations" ON public.metadata
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organizations 
      WHERE id = metadata.organization_id AND user_id = auth.uid()
    )
  );

-- Create RLS policies for documentation
CREATE POLICY "Users can view documentation of their organizations" ON public.documentation
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organizations 
      WHERE id = documentation.organization_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage documentation of their organizations" ON public.documentation
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organizations 
      WHERE id = documentation.organization_id AND user_id = auth.uid()
    )
  );

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email)
  );
  
  -- Assign default viewer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_metadata_updated_at
  BEFORE UPDATE ON public.metadata
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documentation_updated_at
  BEFORE UPDATE ON public.documentation
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();