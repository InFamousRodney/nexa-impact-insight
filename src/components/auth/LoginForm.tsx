import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface LoginFormProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const demoUsers = [
    { name: "Admin User", email: "admin@nexa.ai", role: "Admin", password: "admin123" },
    { name: "Sarah Chen", email: "sarah@acme.com", role: "Contributor", password: "demo123" },
    { name: "Mike Johnson", email: "mike@acme.com", role: "Viewer", password: "demo123" }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = demoUsers.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin({ name: user.name, email: user.email, role: user.role });
    } else {
      alert("Invalid credentials. Try one of the demo accounts.");
    }
  };

  const handleDemoLogin = (user: typeof demoUsers[0]) => {
    onLogin({ name: user.name, email: user.email, role: user.role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-nexa-blue to-nexa-purple flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-nexa-blue to-nexa-purple bg-clip-text text-transparent">
                NEXA
              </h1>
              <p className="text-sm text-muted-foreground">AI Impact Analyzer</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="demo">Demo Access</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Sign in to your NEXA account to analyze Salesforce metadata impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>Demo Accounts</CardTitle>
                <CardDescription>
                  Try NEXA with different user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoUsers.map((user) => (
                  <div key={user.email} 
                       className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                       onClick={() => handleDemoLogin(user)}>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Contributor' ? 'secondary' : 'outline'}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          <p>This is a demo version. Connect Supabase for full authentication.</p>
        </div>
      </div>
    </div>
  );
};