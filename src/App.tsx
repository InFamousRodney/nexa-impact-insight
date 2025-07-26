import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/pages/Dashboard";
import { OrganizationsPage } from "@/pages/OrganizationsPage";
import { AIAssistantPage } from "@/pages/AIAssistantPage";
import { ImpactAnalyzerPage } from "@/pages/ImpactAnalyzerPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexa-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: { name: string; email: string; role: string }) => {
    setUser(userData);
    localStorage.setItem('nexa-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexa-user');
  };

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginForm onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="h-screen flex flex-col bg-background">
            <Header user={user} onLogout={handleLogout} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard user={user} />} />
                  <Route path="/orgs" element={<OrganizationsPage />} />
                  <Route path="/analyzer" element={<ImpactAnalyzerPage />} />
                  <Route path="/assistant" element={<AIAssistantPage />} />
                  <Route path="/metadata" element={<div className="p-6"><h1 className="text-2xl font-bold">Metadata Explorer</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                  <Route path="/docs" element={<div className="p-6"><h1 className="text-2xl font-bold">Documentation</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                  <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
