import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Database,
  GitBranch,
  MessageSquare,
  TrendingUp,
  Clock,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface DashboardProps {
  user: { name: string; email: string; role: string };
}

export const Dashboard = ({ user }: DashboardProps) => {
  const stats = [
    {
      title: "Connected Orgs",
      value: "3",
      change: "+1 this week",
      icon: Building2,
      color: "text-nexa-blue"
    },
    {
      title: "Metadata Objects",
      value: "2,847",
      change: "+127 analyzed",
      icon: Database,
      color: "text-nexa-purple"
    },
    {
      title: "Dependencies Mapped",
      value: "15,293",
      change: "+2,304 new",
      icon: GitBranch,
      color: "text-nexa-cyan"
    },
    {
      title: "AI Queries",
      value: "186",
      change: "+24 today",
      icon: MessageSquare,
      color: "text-green-400"
    }
  ];

  const recentActivity = [
    {
      type: "analysis",
      title: "Impact analysis completed for Contact.Email field",
      org: "Production Org",
      time: "2 minutes ago",
      status: "completed"
    },
    {
      type: "ai",
      title: "AI generated documentation for Account flows",
      org: "Sandbox Org",
      time: "15 minutes ago",
      status: "completed"
    },
    {
      type: "sync",
      title: "Metadata sync started for Development Org",
      org: "Development Org",
      time: "1 hour ago",
      status: "in-progress"
    },
    {
      type: "warning",
      title: "High-impact dependency detected in Lead object",
      org: "Production Org",
      time: "3 hours ago",
      status: "warning"
    }
  ];

  const connectedOrgs = [
    {
      name: "Production Org",
      status: "Connected",
      lastSync: "5 minutes ago",
      metadata: 1247,
      health: 98
    },
    {
      name: "Sandbox Org",
      status: "Connected",
      lastSync: "1 hour ago",
      metadata: 892,
      health: 95
    },
    {
      name: "Development Org",
      status: "Syncing",
      lastSync: "2 hours ago",
      metadata: 708,
      health: 87
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your Salesforce metadata analysis
          </p>
        </div>
        <Button className="bg-gradient-to-r from-nexa-blue to-nexa-purple hover:opacity-90">
          <Zap className="h-4 w-4 mr-2" />
          Quick Analysis
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Organizations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Connected Organizations</span>
            </CardTitle>
            <CardDescription>
              Manage your Salesforce org connections and sync status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectedOrgs.map((org) => (
              <div key={org.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{org.name}</h4>
                    <Badge 
                      variant={org.status === 'Connected' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {org.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {org.metadata} objects • Last sync: {org.lastSync}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">Health:</span>
                    <Progress value={org.health} className="w-16 h-1" />
                    <span className="text-xs text-muted-foreground">{org.health}%</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Building2 className="h-4 w-4 mr-2" />
              Connect New Org
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest analysis, syncs, and AI interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="mt-0.5">
                  {activity.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-400" />}
                  {activity.status === 'in-progress' && <Clock className="h-4 w-4 text-nexa-blue" />}
                  {activity.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">{activity.org}</Badge>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-sm">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Jump into your most common workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col space-y-2">
              <GitBranch className="h-6 w-6" />
              <span className="text-sm">Analyze Dependencies</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Ask AI Assistant</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-2">
              <Database className="h-6 w-6" />
              <span className="text-sm">Browse Metadata</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};