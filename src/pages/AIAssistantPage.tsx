import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  MessageSquare,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Bot,
  User
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    tokens?: number;
    confidence?: number;
    sources?: string[];
  };
}

export const AIAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your NEXA AI Assistant. I can help you understand Salesforce metadata dependencies, analyze impact, and generate documentation. What would you like to know?",
      timestamp: new Date(),
      metadata: { confidence: 100 }
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const exampleQueries = [
    "Where is the Contact.Email field used?",
    "What happens if I delete the Account object?",
    "Show me all flows that use Lead records",
    "Generate documentation for the Opportunity object",
    "What are the dependencies for my custom field?"
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: "Based on my analysis of your Salesforce metadata, the Contact.Email field is used in:\n\n• **3 Process Builder flows** - Lead conversion processes\n• **12 Validation rules** - Email format validation across objects\n• **8 Reports** - Contact communication reports\n• **2 Triggers** - Email domain-based territory assignment\n• **15 Custom fields** - Formula fields referencing email domain\n\nRemoving this field would impact 40+ components. Would you like me to generate a detailed impact report?",
          confidence: 95,
          sources: ["Production Org Metadata", "Flow Definitions", "Validation Rules"]
        },
        {
          content: "I've analyzed your Salesforce metadata and found several critical dependencies. Here's what I discovered:\n\n**Object Usage Analysis:**\n- Used in 23 custom objects as lookup/master-detail\n- Referenced in 45 Process Builder flows\n- 67 reports depend on this data\n\n**Risk Assessment:** HIGH IMPACT\n\nWould you like me to suggest a migration strategy?",
          confidence: 88,
          sources: ["Object Relationships", "Flow Analysis", "Report Dependencies"]
        },
        {
          content: "I've generated comprehensive documentation for your Salesforce implementation:\n\n## Object Documentation Generated\n\n✅ **Standard Objects** (Account, Contact, Lead, Opportunity)\n✅ **Custom Objects** (15 objects documented)\n✅ **Field Dependencies** (247 relationships mapped)\n✅ **Process Flows** (32 flows documented)\n\nThe documentation includes field descriptions, relationships, and usage patterns. Would you like me to export this as a PDF or Confluence page?",
          confidence: 92,
          sources: ["Metadata API", "Object Definitions", "Field Mappings"]
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse.content,
        timestamp: new Date(),
        metadata: {
          tokens: Math.floor(Math.random() * 200) + 50,
          confidence: randomResponse.confidence,
          sources: randomResponse.sources
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleExampleClick = (query: string) => {
    setInput(query);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="p-6 h-[calc(100vh-theme(spacing.24))] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-nexa-blue to-nexa-purple flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span>AI Assistant</span>
        </h1>
        <p className="text-muted-foreground">
          Ask questions about your Salesforce metadata, dependencies, and get instant insights
        </p>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Chat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    GPT-4 Turbo
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-nexa-blue to-nexa-purple flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      
                      {message.metadata && (
                        <div className="mt-2 flex items-center justify-between text-xs opacity-70">
                          <div className="flex items-center space-x-2">
                            {message.metadata.confidence && (
                              <span>Confidence: {message.metadata.confidence}%</span>
                            )}
                            {message.metadata.tokens && (
                              <span>Tokens: {message.metadata.tokens}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => copyMessage(message.content)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-nexa-blue to-nexa-purple flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about metadata dependencies, impact analysis, or documentation..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-nexa-blue to-nexa-purple hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Example Queries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Example Queries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {exampleQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 text-sm"
                  onClick={() => handleExampleClick(query)}
                >
                  <Sparkles className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="whitespace-normal">{query}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Context */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Connected Orgs</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Metadata Objects</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Dependencies</span>
                  <span className="font-medium">15,293</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  AI has access to metadata from all connected orgs and can perform deep dependency analysis.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Usage Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Queries</span>
                  <span className="font-medium">24 / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tokens</span>
                  <span className="font-medium">2,847 / 10,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};