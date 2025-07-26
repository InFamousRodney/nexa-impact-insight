import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  Settings,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";

export const OrganizationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const organizations = [
    {
      id: 1,
      name: "Production Org",
      instanceUrl: "https://mycompany.salesforce.com",
      status: "Connected",
      lastSync: "5 minutes ago",
      metadata: { objects: 247, flows: 45, fields: 1247, triggers: 23 },
      health: 98,
      version: "Spring '24",
      type: "Production"
    },
    {
      id: 2,
      name: "Sandbox Org",
      instanceUrl: "https://mycompany--dev.sandbox.salesforce.com",
      status: "Connected",
      lastSync: "1 hour ago",
      metadata: { objects: 198, flows: 32, fields: 892, triggers: 18 },
      health: 95,
      version: "Spring '24",
      type: "Sandbox"
    },
    {
      id: 3,
      name: "Development Org",
      instanceUrl: "https://mycompany--dev2.sandbox.salesforce.com",
      status: "Syncing",
      lastSync: "2 hours ago",
      metadata: { objects: 156, flows: 28, fields: 708, triggers: 12 },
      health: 87,
      version: "Winter '24",
      type: "Developer"
    },
    {
      id: 4,
      name: "UAT Environment",
      instanceUrl: "https://mycompany--uat.sandbox.salesforce.com",
      status: "Error",
      lastSync: "Failed 3 hours ago",
      metadata: { objects: 0, flows: 0, fields: 0, triggers: 0 },
      health: 0,
      version: "Unknown",
      type: "Sandbox"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Connected':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'Syncing':
        return <Clock className="h-4 w-4 text-nexa-blue animate-spin" />;
      case 'Error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'bg-green-400/10 text-green-400 border-green-400/20';
      case 'Syncing':
        return 'bg-nexa-blue/10 text-nexa-blue border-nexa-blue/20';
      case 'Error':
        return 'bg-red-400/10 text-red-400 border-red-400/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">
            Manage your Salesforce org connections and metadata sync
          </p>
        </div>
        <Button className="bg-gradient-to-r from-nexa-blue to-nexa-purple hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Connect New Org
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync All
        </Button>
      </div>

      {/* Organizations Grid */}
      <div className="grid gap-6">
        {filteredOrgs.map((org) => (
          <Card key={org.id} className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-nexa-blue to-nexa-purple flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{org.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {org.type}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <span>{org.instanceUrl}</span>
                      <ExternalLink className="h-3 w-3" />
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusColor(org.status)} flex items-center space-x-1`}>
                    {getStatusIcon(org.status)}
                    <span>{org.status}</span>
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Metadata Stats */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Metadata Objects</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Objects</span>
                      <span className="font-medium">{org.metadata.objects}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fields</span>
                      <span className="font-medium">{org.metadata.fields}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Flows</span>
                      <span className="font-medium">{org.metadata.flows}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Triggers</span>
                      <span className="font-medium">{org.metadata.triggers}</span>
                    </div>
                  </div>
                </div>

                {/* Sync Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Sync Status</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Last Sync</span>
                      <p className="font-medium">{org.lastSync}</p>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Version</span>
                      <p className="font-medium">{org.version}</p>
                    </div>
                  </div>
                </div>

                {/* Health */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Org Health</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Progress value={org.health} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{org.health}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {org.health > 95 ? 'Excellent' : org.health > 85 ? 'Good' : org.health > 70 ? 'Fair' : 'Poor'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Sync Now
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Search className="h-3 w-3 mr-2" />
                      Explore
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No organizations found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search" : "Connect your first Salesforce org to get started"}
          </p>
        </div>
      )}
    </div>
  );
};