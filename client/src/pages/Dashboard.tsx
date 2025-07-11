import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Sidebar } from "@/components/layout/Sidebar";
import { Link } from "wouter";
import {
  Brain,
  MessageSquare,
  Users,
  Briefcase,
  Search,
  Bus,
  Linkedin,
  TrendingUp,
  Calendar,
  Bell,
  Award,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: opportunities = [] } = useQuery({
    queryKey: ["/api/opportunities"],
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const { data: busRoute } = useQuery({
    queryKey: ["/api/bus-routes/my-bus"],
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const quickActions = [
    { title: "Ask AI", icon: Brain, href: "/ask", color: "bg-blue-500" },
    { title: "Forums", icon: MessageSquare, href: "/forums", color: "bg-green-500" },
    { title: "Mentors", icon: Users, href: "/mentor", color: "bg-purple-500" },
    { title: "Opportunities", icon: Briefcase, href: "/opportunities", color: "bg-orange-500" },
    { title: "Lost & Found", icon: Search, href: "/lost-found", color: "bg-red-500" },
    { title: "Bus Tracker", icon: Bus, href: "/bus", color: "bg-indigo-500" },
  ];

  const stats = [
    { title: "Questions Asked", value: "23", icon: MessageSquare, color: "text-blue-600" },
    { title: "Answers Given", value: "45", icon: Users, color: "text-green-600" },
    { title: "Network Size", value: "127", icon: TrendingUp, color: "text-purple-600" },
    { title: "Events Attended", value: "12", icon: Calendar, color: "text-orange-600" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="hidden md:block border-r bg-white" />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-gray-600">
                  {user.role} at {user.collegeId?.replace('-', ' ')} • {user.department}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  {notifications.length} Notifications
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Brain className="h-4 w-4 mr-2" />
                  Ask AI
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <Card className="hover:shadow-md transition-all cursor-pointer transform hover:scale-105">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.title}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">{stat.title}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                          </div>
                          <Icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* AI Assistant Quick Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    KnowZone AI Assistant
                    <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Powered by Gemini
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                      💡 <strong>Quick Tip:</strong> Ask me about your coursework, career guidance, or anything related to your academic journey!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-600">
                        "Career guidance for CSE"
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-600">
                        "Best resources for DSA"
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-600">
                        "Interview preparation"
                      </span>
                    </div>
                  </div>
                  <Link href="/ask">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Brain className="h-4 w-4 mr-2" />
                      Start Conversation with AI
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Latest Opportunities</span>
                    <Link href="/opportunities">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {opportunities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No opportunities available at the moment</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {opportunities.slice(0, 3).map((opportunity: any) => (
                        <div key={opportunity.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                              <p className="text-sm text-gray-600">{opportunity.company}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {opportunity.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Bus Tracker Widget */}
              {busRoute && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bus className="h-5 w-5 mr-2" />
                      Your Bus: {busRoute.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{busRoute.route}</p>
                    <p className="text-sm text-gray-600 mb-3">
                      Driver: {busRoute.driverName}
                    </p>
                    <Link href="/bus">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Track Live Location
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Forum Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Forum Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">VTU Forum</p>
                      <p className="text-xs text-gray-600">24 new posts today</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">College Forum</p>
                      <p className="text-xs text-gray-600">12 new posts today</p>
                    </div>
                  </div>
                  <Link href="/forums">
                    <Button variant="outline" className="w-full mt-3">
                      Join Discussions
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        🏆
                      </div>
                      <div>
                        <p className="text-sm font-medium">Helpful Helper</p>
                        <p className="text-xs text-gray-600">Answered 10+ questions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        💡
                      </div>
                      <div>
                        <p className="text-sm font-medium">Curious Learner</p>
                        <p className="text-xs text-gray-600">Asked 20+ questions</p>
                      </div>
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
