import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Star, 
  Filter,
  Users,
  Clock,
  Phone,
  Mail
} from 'lucide-react';

const mockWorkers = [
  {
    id: '1',
    name: 'John Smith',
    title: 'Senior Crane Operator',
    location: 'Houston, TX',
    rating: 4.8,
    experience: '8 years',
    skills: ['Tower Crane', 'Mobile Crane', 'Safety Certified'],
    availability: 'Available',
    hourlyRate: 45,
    profilePicture: null,
  },
  {
    id: '2',
    name: 'Maria Garcia',
    title: 'Safety Inspector',
    location: 'Denver, CO',
    rating: 4.9,
    experience: '6 years',
    skills: ['OSHA Certified', 'Risk Assessment', 'Incident Investigation'],
    availability: 'Available',
    hourlyRate: 38,
    profilePicture: null,
  },
  {
    id: '3',
    name: 'David Johnson',
    title: 'Project Manager',
    location: 'Phoenix, AZ',
    rating: 4.7,
    experience: '12 years',
    skills: ['Project Planning', 'Team Leadership', 'Budget Management'],
    availability: 'Busy',
    hourlyRate: 55,
    profilePicture: null,
  },
];

export default function WorkerSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Worker Search</h1>
          <p className="text-gray-600 mt-1">Find qualified workers for your construction projects.</p>
        </div>
        <Button>
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, title, or skills..."
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Location"
                className="pl-10"
              />
            </div>
            <Input
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="Required skills"
            />
            <Button className="w-full">
              Search Workers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockWorkers.map((worker) => (
          <Card key={worker.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{worker.name}</CardTitle>
                    <CardDescription>{worker.title}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{worker.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{worker.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{worker.experience}</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {worker.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-600">Hourly Rate:</span>
                    <div className="text-lg font-semibold text-gray-900">${worker.hourlyRate}</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        worker.availability === 'Available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {worker.availability}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" className="flex-1">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Workers
        </Button>
      </div>
    </div>
  );
}
