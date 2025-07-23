import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Calendar, 
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Phone,
  Video,
  UserCheck
} from 'lucide-react';

const recruitmentPipelineStages = [
  { id: '1', name: 'Application', count: 47, color: 'bg-blue-500' },
  { id: '2', name: 'Screening', count: 23, color: 'bg-yellow-500' },
  { id: '3', name: 'Interview', count: 12, color: 'bg-purple-500' },
  { id: '4', name: 'Assessment', count: 8, color: 'bg-orange-500' },
  { id: '5', name: 'Offer', count: 3, color: 'bg-green-500' },
];

const candidatesInPipeline = [
  {
    id: '1',
    name: 'John Smith',
    position: 'Senior Crane Operator',
    currentStage: 'Interview',
    rating: 4.8,
    appliedDate: '2024-01-15',
    nextAction: 'Schedule final interview',
    nextActionDate: '2024-01-20',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    position: 'Safety Inspector',
    currentStage: 'Assessment',
    rating: 4.9,
    appliedDate: '2024-01-12',
    nextAction: 'Skills assessment',
    nextActionDate: '2024-01-18',
  },
  {
    id: '3',
    name: 'David Johnson',
    position: 'Project Manager',
    currentStage: 'Screening',
    rating: 4.7,
    appliedDate: '2024-01-10',
    nextAction: 'Phone screening',
    nextActionDate: '2024-01-17',
  },
];

const upcomingInterviews = [
  {
    id: '1',
    candidateName: 'John Smith',
    position: 'Senior Crane Operator',
    date: '2024-01-20',
    time: '10:00 AM',
    type: 'video',
    interviewer: 'Sarah Wilson',
  },
  {
    id: '2',
    candidateName: 'Lisa Brown',
    position: 'Safety Coordinator',
    date: '2024-01-20',
    time: '2:00 PM',
    type: 'phone',
    interviewer: 'Mike Davis',
  },
  {
    id: '3',
    candidateName: 'Robert Taylor',
    position: 'Equipment Operator',
    date: '2024-01-21',
    time: '9:00 AM',
    type: 'in_person',
    interviewer: 'Tom Anderson',
  },
];

export default function RecruitmentProcessing() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruitment Pipeline</h1>
          <p className="text-gray-600 mt-1">Manage your recruitment process and candidate pipeline.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <UserCheck className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Pipeline</CardTitle>
          <CardDescription>Track candidates through each stage of your hiring process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4">
            {recruitmentPipelineStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center flex-1">
                <div 
                  className={`flex-1 cursor-pointer ${selectedStage === stage.id ? 'ring-2 ring-primary-500' : ''}`}
                  onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                >
                  <div className="text-center">
                    <div className={`${stage.color} rounded-lg p-4 mb-2`}>
                      <div className="text-white font-bold text-xl">{stage.count}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">{stage.name}</div>
                  </div>
                </div>
                
                {index < recruitmentPipelineStages.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Candidates */}
        <Card>
          <CardHeader>
            <CardTitle>Active Candidates</CardTitle>
            <CardDescription>Candidates currently in your recruitment pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidatesInPipeline.map((candidate) => (
                <div key={candidate.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                      <p className="text-sm text-gray-600">{candidate.position}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-yellow-600">★ {candidate.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">Current Stage:</span>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {candidate.currentStage}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Next:</span>
                        <span className="ml-2">{candidate.nextAction}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button size="sm">
                          Move Forward
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                View All Candidates
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Scheduled interviews for the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => {
                const getInterviewIcon = (type: string) => {
                  switch (type) {
                    case 'video': return <Video className="w-4 h-4" />;
                    case 'phone': return <Phone className="w-4 h-4" />;
                    default: return <Users className="w-4 h-4" />;
                  }
                };

                const getInterviewTypeLabel = (type: string) => {
                  switch (type) {
                    case 'video': return 'Video Call';
                    case 'phone': return 'Phone Call';
                    case 'in_person': return 'In Person';
                    default: return 'Interview';
                  }
                };

                return (
                  <div key={interview.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{interview.candidateName}</h4>
                        <p className="text-sm text-gray-600">{interview.position}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        {getInterviewIcon(interview.type)}
                        <span>{getInterviewTypeLabel(interview.type)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(interview.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{interview.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Interviewer: {interview.interviewer}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button size="sm">
                            Join Interview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                View All Interviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common recruitment tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Calendar className="w-6 h-6" />
              <span>Schedule Interview</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <FileText className="w-6 h-6" />
              <span>Send Assessment</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <CheckCircle className="w-6 h-6" />
              <span>Make Offer</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <XCircle className="w-6 h-6" />
              <span>Reject Candidate</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
