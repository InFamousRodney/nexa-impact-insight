import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Share,
  Zap,
  Database,
  Settings,
  Code,
  FileText
} from "lucide-react";

interface DependencyNode {
  id: string;
  name: string;
  type: 'object' | 'field' | 'flow' | 'trigger' | 'report' | 'validation';
  impact: 'high' | 'medium' | 'low';
  dependencies: string[];
}

export const ImpactAnalyzerPage = () => {
  const [selectedOrg, setSelectedOrg] = useState("prod");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMetadata, setSelectedMetadata] = useState<DependencyNode | null>(null);

  const mockMetadata: DependencyNode[] = [
    {
      id: 'contact-email',
      name: 'Contact.Email',
      type: 'field',
      impact: 'high',
      dependencies: ['lead-conversion-flow', 'email-validation', 'contact-reports', 'territory-trigger']
    },
    {
      id: 'account-object',
      name: 'Account',
      type: 'object',
      impact: 'high',
      dependencies: ['opportunity-object', 'contact-object', 'account-reports', 'territory-management']
    },
    {
      id: 'lead-conversion-flow',
      name: 'Lead Conversion Process',
      type: 'flow',
      impact: 'medium',
      dependencies: ['contact-email', 'account-object', 'opportunity-object']
    },
    {
      id: 'opportunity-stage',
      name: 'Opportunity.StageName',
      type: 'field',
      impact: 'medium',
      dependencies: ['sales-process', 'opportunity-reports', 'stage-validation']
    }
  ];

  const impactLevels = {
    high: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: AlertTriangle },
    medium: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Clock },
    low: { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle }
  };

  const metadataTypeIcons = {
    object: Database,
    field: Settings,
    flow: GitBranch,
    trigger: Code,
    report: FileText,
    validation: CheckCircle
  };

  const filteredMetadata = mockMetadata.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAnalyze = (metadata: DependencyNode) => {
    setSelectedMetadata(metadata);
  };

  const getDependencyData = (metadata: DependencyNode) => {
    const dependencyDetails = [
      {
        name: 'Lead Conversion Process',
        type: 'Process Builder Flow',
        impact: 'High',
        description: 'Critical business process that converts leads to contacts',
        affectedRecords: '~2,500 leads/month',
        riskLevel: 'Critical'
      },
      {
        name: 'Email Validation Rules',
        type: 'Validation Rule',
        impact: 'Medium',
        description: 'Ensures email format compliance across all objects',
        affectedRecords: '~500 records/day',
        riskLevel: 'Medium'
      },
      {
        name: 'Contact Communication Reports',
        type: 'Reports & Dashboards',
        impact: 'Medium',
        description: '12 reports used by sales and marketing teams',
        affectedRecords: 'All contact records',
        riskLevel: 'Medium'
      },
      {
        name: 'Territory Assignment Trigger',
        type: 'Apex Trigger',
        impact: 'High',
        description: 'Automatically assigns territories based on email domain',
        affectedRecords: 'All new contacts',
        riskLevel: 'High'
      },
      {
        name: 'Email Domain Formulas',
        type: 'Formula Fields',
        impact: 'Low',
        description: '15 formula fields extracting domain information',
        affectedRecords: 'All contact records',
        riskLevel: 'Low'
      }
    ];

    return dependencyDetails;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <GitBranch className="h-8 w-8 text-nexa-blue" />
            <span>Impact Analyzer</span>
          </h1>
          <p className="text-muted-foreground">
            Analyze metadata dependencies and assess the impact of changes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Metadata Selection */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Metadata for Analysis</CardTitle>
              <CardDescription>
                Choose the Salesforce metadata element you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Org Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">Organization</label>
                <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prod">Production Org</SelectItem>
                    <SelectItem value="sandbox">Sandbox Org</SelectItem>
                    <SelectItem value="dev">Development Org</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search Metadata</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search objects, fields, flows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Metadata List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMetadata.map((metadata) => {
                  const IconComponent = metadataTypeIcons[metadata.type];
                  const impactConfig = impactLevels[metadata.impact];
                  
                  return (
                    <div
                      key={metadata.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleAnalyze(metadata)}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{metadata.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{metadata.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${impactConfig.color}`}>
                          {metadata.impact} impact
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Zap className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Analysis Results */}
        <div className="space-y-6">
          {selectedMetadata ? (
            <>
              {/* Analysis Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GitBranch className="h-5 w-5" />
                    <span>Impact Analysis: {selectedMetadata.name}</span>
                  </CardTitle>
                  <CardDescription>
                    Dependencies and potential impact of changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-400">5</p>
                      <p className="text-xs text-muted-foreground">Direct Dependencies</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">12</p>
                      <p className="text-xs text-muted-foreground">Indirect Dependencies</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-nexa-blue">~3K</p>
                      <p className="text-xs text-muted-foreground">Affected Records</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Risk Assessment</span>
                      <span className="font-medium text-red-400">HIGH IMPACT</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full" style={{width: "85%"}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dependencies List */}
              <Card>
                <CardHeader>
                  <CardTitle>Dependencies Found</CardTitle>
                  <CardDescription>
                    Detailed breakdown of all dependencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getDependencyData(selectedMetadata).map((dep, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{dep.name}</h4>
                          <Badge 
                            className={
                              dep.riskLevel === 'Critical' ? 'bg-red-500/10 text-red-400' :
                              dep.riskLevel === 'High' ? 'bg-orange-500/10 text-orange-400' :
                              dep.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                              'bg-green-500/10 text-green-400'
                            }
                          >
                            {dep.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{dep.type}</p>
                        <p className="text-sm mb-2">{dep.description}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Impact: {dep.impact}</span>
                          <span>{dep.affectedRecords}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                      <div>
                        <p className="font-medium">High Risk Change</p>
                        <p className="text-muted-foreground">This change will impact critical business processes. Consider a phased rollout.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Test in Sandbox First</p>
                        <p className="text-muted-foreground">Deploy to sandbox environment and run full regression tests.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Schedule Maintenance Window</p>
                        <p className="text-muted-foreground">Plan deployment during low-usage hours to minimize impact.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center">
                <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select Metadata to Analyze</h3>
                <p className="text-muted-foreground">
                  Choose a metadata element from the left panel to see its impact analysis
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};