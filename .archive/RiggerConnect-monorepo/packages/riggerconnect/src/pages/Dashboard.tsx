import { 
  Users, 
  BriefcaseIcon, 
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const stats = [
  {
    name: 'Active Jobs',
    value: '12',
    change: '+2.5%',
    changeType: 'positive',
    icon: BriefcaseIcon,
  },
  {
    name: 'Total Workers',
    value: '284',
    change: '+4.2%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Pending Applications',
    value: '47',
    change: '+12.3%',
    changeType: 'positive',
    icon: Clock,
  },
  {
    name: 'Monthly Spend',
    value: '$24,500',
    change: '-8.1%',
    changeType: 'negative',
    icon: DollarSign,
  },
];

const recentJobs = [
  {
    id: '1',
    title: 'Senior Crane Operator',
    location: 'Houston, TX',
    applications: 23,
    status: 'active',
    postedAt: '2 days ago',
  },
  {
    id: '2',
    title: 'Safety Inspector',
    location: 'Denver, CO',
    applications: 15,
    status: 'active',
    postedAt: '5 days ago',
  },
  {
    id: '3',
    title: 'Project Manager',
    location: 'Phoenix, AZ',
    applications: 8,
    status: 'draft',
    postedAt: '1 week ago',
  },
];

const recentApplications = [
  {
    id: '1',
    workerName: 'John Smith',
    jobTitle: 'Senior Crane Operator',
    appliedAt: '2 hours ago',
    status: 'pending',
    rating: 4.8,
  },
  {
    id: '2',
    workerName: 'Maria Garcia',
    jobTitle: 'Safety Inspector',
    appliedAt: '4 hours ago',
    status: 'reviewed',
    rating: 4.9,
  },
  {
    id: '3',
    workerName: 'David Johnson',
    jobTitle: 'Project Manager',
    appliedAt: '1 day ago',
    status: 'shortlisted',
    rating: 4.7,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your recruitment.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            View Reports
          </Button>
          <Button>
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="business-gradient p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>Your latest job postings and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.location}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">{job.applications} applications</span>
                      <span className="text-sm text-gray-500">{job.postedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        job.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {job.status}
                    </span>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                View All Jobs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest applications from workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{application.workerName}</h4>
                      <p className="text-sm text-gray-600">{application.jobTitle}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">{application.appliedAt}</span>
                        <span className="text-sm text-yellow-600">★ {application.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        application.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'reviewed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {application.status}
                    </span>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                View All Applications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <BriefcaseIcon className="w-6 h-6" />
              <span>Post New Job</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="w-6 h-6" />
              <span>Search Workers</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
