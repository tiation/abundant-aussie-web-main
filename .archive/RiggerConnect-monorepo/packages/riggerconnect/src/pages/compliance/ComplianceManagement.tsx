import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  Download,
  Upload
} from 'lucide-react';

const complianceStats = [
  {
    name: 'Verified Workers',
    value: '234',
    change: '+12',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    name: 'Pending Reviews',
    value: '18',
    change: '+3',
    icon: Clock,
    color: 'text-yellow-600',
  },
  {
    name: 'Expired Certifications',
    value: '7',
    change: '-2',
    icon: AlertTriangle,
    color: 'text-red-600',
  },
  {
    name: 'Safety Incidents',
    value: '2',
    change: '0',
    icon: Shield,
    color: 'text-blue-600',
  },
];

const recentComplianceItems = [
  {
    id: '1',
    workerName: 'John Smith',
    type: 'Safety Training',
    status: 'approved',
    expiryDate: '2024-12-15',
    verifiedAt: '2024-01-15',
  },
  {
    id: '2',
    workerName: 'Maria Garcia',
    type: 'Background Check',
    status: 'pending',
    expiryDate: null,
    verifiedAt: null,
  },
  {
    id: '3',
    workerName: 'David Johnson',
    type: 'Drug Test',
    status: 'expired',
    expiryDate: '2024-01-10',
    verifiedAt: '2023-01-10',
  },
];

export default function ComplianceManagement() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage worker compliance and safety requirements.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">
                    {stat.change !== '0' && (stat.change.startsWith('+') ? '+' : '')}{stat.change} this month
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Compliance Items */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Compliance Updates</CardTitle>
            <CardDescription>Latest compliance status changes and verifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComplianceItems.map((item) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'approved': return 'bg-green-100 text-green-800';
                    case 'pending': return 'bg-yellow-100 text-yellow-800';
                    case 'expired': return 'bg-red-100 text-red-800';
                    default: return 'bg-gray-100 text-gray-800';
                  }
                };

                return (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.workerName}</h4>
                        <p className="text-sm text-gray-600">{item.type}</p>
                        {item.expiryDate && (
                          <p className="text-xs text-gray-500">
                            Expires: {new Date(item.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                View All Compliance Records
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Actions</CardTitle>
            <CardDescription>Quick actions for compliance management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full justify-start h-16" variant="outline">
                <FileCheck className="w-6 h-6 mr-4" />
                <div className="text-left">
                  <div className="font-medium">Verify Certifications</div>
                  <div className="text-sm text-gray-500">Review pending certifications</div>
                </div>
              </Button>
              
              <Button className="w-full justify-start h-16" variant="outline">
                <Shield className="w-6 h-6 mr-4" />
                <div className="text-left">
                  <div className="font-medium">Safety Training</div>
                  <div className="text-sm text-gray-500">Schedule and track training</div>
                </div>
              </Button>
              
              <Button className="w-full justify-start h-16" variant="outline">
                <AlertTriangle className="w-6 h-6 mr-4" />
                <div className="text-left">
                  <div className="font-medium">Report Incident</div>
                  <div className="text-sm text-gray-500">Document safety incidents</div>
                </div>
              </Button>
              
              <Button className="w-full justify-start h-16" variant="outline">
                <Users className="w-6 h-6 mr-4" />
                <div className="text-left">
                  <div className="font-medium">Background Checks</div>
                  <div className="text-sm text-gray-500">Manage worker background verification</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Expirations</CardTitle>
          <CardDescription>Certifications and compliance items expiring soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No upcoming expirations in the next 30 days.</p>
            <p className="text-sm">This is a placeholder for the compliance calendar view.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
