import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Database,
  GitBranch,
  MessageSquare,
  FileText,
  Settings,
  Building2,
  Zap
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Organizations",
    href: "/orgs",
    icon: Building2,
  },
  {
    name: "Metadata Explorer",
    href: "/metadata",
    icon: Database,
  },
  {
    name: "Impact Analyzer",
    href: "/analyzer",
    icon: GitBranch,
  },
  {
    name: "AI Assistant",
    href: "/assistant",
    icon: MessageSquare,
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-card border-r border-border">
      <div className="p-6">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-nexa-blue/10 to-nexa-purple/10 rounded-lg border border-nexa-blue/20">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-nexa-blue" />
            <span className="text-sm font-medium">AI Credits</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>750 / 1,000 remaining</p>
            <div className="w-full bg-muted rounded-full h-1 mt-1">
              <div className="bg-gradient-to-r from-nexa-blue to-nexa-purple h-1 rounded-full" style={{width: "75%"}}></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};