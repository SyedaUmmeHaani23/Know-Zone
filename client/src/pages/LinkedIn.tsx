import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Linkedin, 
  ExternalLink, 
  Users, 
  Building, 
  GraduationCap,
  MapPin,
  Filter,
  Search,
  UserPlus,
  TrendingUp
} from "lucide-react";

export default function LinkedIn() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [collegeFilter, setCollegeFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");

  const { data: linkedinUsers = [], isLoading } = useQuery({
    queryKey: ["/api/users/linkedin"],
  });

  const { data: colleges = [] } = useQuery({
    queryKey: ["/api/colleges"],
  });

  const filteredUsers = linkedinUsers.filter((user: any) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.branch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesCollege = collegeFilter === "all" || user.collegeId === collegeFilter;
    const matchesBranch = branchFilter === "all" || user.branch === branchFilter;
    
    return matchesSearch && matchesRole && matchesCollege && matchesBranch;
  });

  const uniqueBranches = [...new Set(linkedinUsers.map((user: any) => user.branch))];

  const handleConnectLinkedIn = (linkedinUrl: string) => {
    window.open(linkedinUrl, "_blank");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="hidden md:block border-r bg-white" />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Linkedin className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">Professional Network</h1>
                </div>
                <p className="text-gray-600">
                  Connect with alumni and professionals across colleges on LinkedIn
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {linkedinUsers.length} Professionals
                </Badge>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Input
                  placeholder="Search professionals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                </SelectContent>
              </Select>
              <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Colleges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colleges</SelectItem>
                  {colleges.map((college: any) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {uniqueBranches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <EmptyState
                  icon={<Linkedin className="h-12 w-12" />}
                  title="No Professionals Found"
                  description={searchQuery ? "Try adjusting your search or filters" : "No professionals with LinkedIn profiles found"}
                />
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredUsers.map((user: any) => (
                    <Card key={user.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <Avatar className="h-20 w-20 mx-auto mb-4">
                            <AvatarImage src={user.profileImage} />
                            <AvatarFallback className="text-lg">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {user.name}
                          </h3>
                          
                          <div className="flex items-center justify-center space-x-2 mb-3">
                            <Badge 
                              className={
                                user.role === "student" 
                                  ? "bg-blue-100 text-blue-800"
                                  : user.role === "alumni"
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-purple-100 text-purple-800"
                              }
                            >
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                            {user.year && (
                              <Badge variant="outline" className="text-xs">
                                {user.year === "graduated" ? "Graduate" : `Year ${user.year}`}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-center text-sm text-gray-600">
                              <GraduationCap className="h-4 w-4 mr-2" />
                              <span>{user.department}</span>
                            </div>
                            
                            <div className="flex items-center justify-center text-sm text-gray-600">
                              <Building className="h-4 w-4 mr-2" />
                              <span>{user.branch}</span>
                            </div>
                            
                            <div className="flex items-center justify-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{colleges.find((c: any) => c.id === user.collegeId)?.name || "Unknown College"}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Button
                              onClick={() => handleConnectLinkedIn(user.linkedinUrl)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Linkedin className="h-4 w-4 mr-2" />
                              Connect on LinkedIn
                            </Button>
                            
                            <Button
                              variant="outline"
                              className="w-full"
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* LinkedIn Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Linkedin className="h-5 w-5 mr-2 text-blue-600" />
                    Network Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Professionals</span>
                    <span className="font-semibold">{linkedinUsers.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Students</span>
                    <span className="font-semibold text-blue-600">
                      {linkedinUsers.filter((u: any) => u.role === "student").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Alumni</span>
                    <span className="font-semibold text-green-600">
                      {linkedinUsers.filter((u: any) => u.role === "alumni").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Faculty</span>
                    <span className="font-semibold text-purple-600">
                      {linkedinUsers.filter((u: any) => u.role === "faculty").length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Colleges */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Colleges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {colleges.slice(0, 5).map((college: any) => {
                      const userCount = linkedinUsers.filter((u: any) => u.collegeId === college.id).length;
                      return (
                        <div key={college.id} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{college.name}</p>
                            <p className="text-xs text-gray-500">{college.city}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {userCount}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Branches */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Branches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {uniqueBranches.slice(0, 6).map((branch) => {
                      const count = linkedinUsers.filter((u: any) => u.branch === branch).length;
                      return (
                        <div key={branch} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{branch}</span>
                          <Badge variant="outline" className="text-xs">
                            {count}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Networking Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🤝 Networking Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    • Personalize your connection requests
                  </p>
                  <p className="text-sm text-gray-600">
                    • Engage with posts and updates
                  </p>
                  <p className="text-sm text-gray-600">
                    • Join relevant industry groups
                  </p>
                  <p className="text-sm text-gray-600">
                    • Share valuable content regularly
                  </p>
                  <p className="text-sm text-gray-600">
                    • Follow up on connections made
                  </p>
                </CardContent>
              </Card>

              {/* LinkedIn Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Why LinkedIn?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">💼</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Career Opportunities</p>
                      <p className="text-xs text-gray-600">Discover jobs and internships</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">🎓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Learn & Grow</p>
                      <p className="text-xs text-gray-600">Access learning resources</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">🌐</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Global Network</p>
                      <p className="text-xs text-gray-600">Connect worldwide</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
