
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  Database
} from 'lucide-react';

interface DataRequest {
  id: string;
  userId: string;
  userEmail: string;
  type: 'export' | 'deletion' | 'access';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

interface ConsentRecord {
  userId: string;
  userEmail: string;
  consentTypes: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  };
  lastUpdated: string;
  ipAddress: string;
}

export const GDPRManager: React.FC = () => {
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([
    {
      id: 'REQ-001',
      userId: 'user-123',
      userEmail: 'john.doe@example.com',
      type: 'export',
      status: 'completed',
      createdAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-15T11:45:00Z',
    },
    {
      id: 'REQ-002',
      userId: 'user-456',
      userEmail: 'jane.smith@example.com',
      type: 'deletion',
      status: 'pending',
      createdAt: '2024-01-16T14:20:00Z',
    }
  ]);

  const [consentRecords] = useState<ConsentRecord[]>([
    {
      userId: 'user-123',
      userEmail: 'john.doe@example.com',
      consentTypes: {
        necessary: true,
        analytics: true,
        marketing: false,
        preferences: true,
      },
      lastUpdated: '2024-01-15T09:00:00Z',
      ipAddress: '192.168.1.100',
    }
  ]);

  const [searchEmail, setSearchEmail] = useState('');

  const handleProcessRequest = async (requestId: string, action: 'approve' | 'reject') => {
    setDataRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: action === 'approve' ? 'processing' : 'failed',
              notes: action === 'reject' ? 'Request rejected by admin' : undefined
            }
          : req
      )
    );
  };

  const handleExportUserData = async (userId: string) => {
    // Implementation for data export
    console.log(`Exporting data for user: ${userId}`);
  };

  const handleDeleteUserData = async (userId: string) => {
    // Implementation for data deletion
    console.log(`Deleting data for user: ${userId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'pending': return 'outline';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'processing': return Clock;
      case 'pending': return AlertTriangle;
      case 'failed': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">GDPR Compliance Manager</h1>
          <p className="text-crd-lightGray">Data protection and privacy compliance tools</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Privacy Policy
          </Button>
          <Button>
            <Shield className="w-4 h-4 mr-2" />
            Compliance Report
          </Button>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-crd-lightGray">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {dataRequests.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-crd-lightGray">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-crd-lightGray">Data Exports</CardTitle>
            <Download className="h-4 w-4 text-crd-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {dataRequests.filter(r => r.type === 'export').length}
            </div>
            <p className="text-xs text-crd-lightGray">Total this month</p>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-crd-lightGray">Data Deletions</CardTitle>
            <Trash2 className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {dataRequests.filter(r => r.type === 'deletion').length}
            </div>
            <p className="text-xs text-crd-lightGray">Total this month</p>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-crd-lightGray">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-crd-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-crd-green">98%</div>
            <p className="text-xs text-crd-lightGray">GDPR compliance</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-crd-dark border-crd-mediumGray">
          <TabsTrigger value="requests">Data Requests</TabsTrigger>
          <TabsTrigger value="consent">Consent Management</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-white">Data Subject Requests</CardTitle>
              <CardDescription>Manage user data requests under GDPR Article 15-17</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="outline">Filter</Button>
              </div>

              {/* Requests List */}
              <div className="space-y-4">
                {dataRequests.map((request) => {
                  const StatusIcon = getStatusIcon(request.status);
                  return (
                    <div key={request.id} className="border border-crd-mediumGray rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-white">Request #{request.id}</h3>
                            <Badge variant={getStatusColor(request.status)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {request.status}
                            </Badge>
                            <Badge variant="outline">
                              {request.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-crd-lightGray">{request.userEmail}</p>
                          <p className="text-xs text-crd-lightGray">
                            Created: {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleProcessRequest(request.id, 'reject')}
                              >
                                Reject
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleProcessRequest(request.id, 'approve')}
                              >
                                Approve
                              </Button>
                            </>
                          )}
                          {request.status === 'completed' && request.type === 'export' && (
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                      
                      {request.notes && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{request.notes}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-white">Consent Management</CardTitle>
              <CardDescription>Track and manage user consent preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consentRecords.map((record, index) => (
                  <div key={index} className="border border-crd-mediumGray rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-white">{record.userEmail}</h3>
                        <p className="text-sm text-crd-lightGray">
                          Last updated: {new Date(record.lastUpdated).toLocaleString()}
                        </p>
                        <p className="text-xs text-crd-lightGray">IP: {record.ipAddress}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-crd-lightGray">Necessary</Label>
                        <Badge variant={record.consentTypes.necessary ? 'default' : 'outline'}>
                          {record.consentTypes.necessary ? 'Granted' : 'Denied'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-crd-lightGray">Analytics</Label>
                        <Badge variant={record.consentTypes.analytics ? 'default' : 'outline'}>
                          {record.consentTypes.analytics ? 'Granted' : 'Denied'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-crd-lightGray">Marketing</Label>
                        <Badge variant={record.consentTypes.marketing ? 'default' : 'outline'}>
                          {record.consentTypes.marketing ? 'Granted' : 'Denied'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-crd-lightGray">Preferences</Label>
                        <Badge variant={record.consentTypes.preferences ? 'default' : 'outline'}>
                          {record.consentTypes.preferences ? 'Granted' : 'Denied'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-white">Audit Logs</CardTitle>
              <CardDescription>Comprehensive logging of all data processing activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-crd-mediumGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-crd-green" />
                    <div>
                      <p className="text-sm font-medium text-white">Data Export Completed</p>
                      <p className="text-xs text-crd-lightGray">john.doe@example.com - Request #REQ-001</p>
                    </div>
                  </div>
                  <span className="text-xs text-crd-lightGray">2 hours ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-crd-mediumGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-white">Consent Updated</p>
                      <p className="text-xs text-crd-lightGray">jane.smith@example.com - Marketing consent withdrawn</p>
                    </div>
                  </div>
                  <span className="text-xs text-crd-lightGray">5 hours ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-crd-mediumGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Data Deletion Request</p>
                      <p className="text-xs text-crd-lightGray">user.delete@example.com - Request pending approval</p>
                    </div>
                  </div>
                  <span className="text-xs text-crd-lightGray">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">Data Retention</CardTitle>
                <CardDescription>Configure automatic data cleanup policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Inactive User Data</Label>
                    <p className="text-sm text-crd-lightGray">Delete after 36 months of inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Analytics Data</Label>
                    <p className="text-sm text-crd-lightGray">Anonymize after 26 months</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Deleted User Logs</Label>
                    <p className="text-sm text-crd-lightGray">Purge logs after 7 years</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">Automated Responses</CardTitle>
                <CardDescription>Configure automatic handling of data requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Auto-approve Data Exports</Label>
                    <p className="text-sm text-crd-lightGray">For verified users only</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-crd-lightGray">Notify users of request status</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Admin Alerts</Label>
                    <p className="text-sm text-crd-lightGray">Alert on urgent requests</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
