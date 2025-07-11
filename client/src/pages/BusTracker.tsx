import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Bus, 
  MapPin, 
  Clock, 
  Phone, 
  Users, 
  Navigation,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";

export default function BusTracker() {
  const { user } = useAuth();

  const { data: myBusRoute, isLoading: busLoading, refetch: refetchBus } = useQuery({
    queryKey: ["/api/bus-routes/my-bus"],
  });

  const { data: allBusRoutes = [], isLoading: allBusesLoading } = useQuery({
    queryKey: ["/api/bus-routes"],
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="hidden md:block border-r bg-white" />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Bus Tracker</h1>
                <p className="text-gray-600">
                  Track your college bus in real-time and connect with co-passengers
                </p>
              </div>
              <Button
                onClick={() => refetchBus()}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Location
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* My Bus */}
            <div className="lg:col-span-2">
              {busLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : !myBusRoute ? (
                <EmptyState
                  icon={<Bus className="h-12 w-12" />}
                  title="No Bus Assigned"
                  description="You haven't been assigned to any bus route yet. Contact your college administration to get assigned to a bus."
                  action={
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Contact Administration
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-6">
                  {/* Bus Route Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                          <Bus className="h-5 w-5 text-white" />
                        </div>
                        {myBusRoute.id} - {myBusRoute.route}
                        <Badge className="ml-auto bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Driver</p>
                              <p className="text-sm text-gray-600">{myBusRoute.driverName}</p>
                            </div>
                          </div>
                          
                          {myBusRoute.driverContact && (
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <Phone className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Contact</p>
                                <p className="text-sm text-gray-600">{myBusRoute.driverContact}</p>
                              </div>
                            </div>
                          )}
                          
                          {myBusRoute.timings && (
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Clock className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Timings</p>
                                <p className="text-sm text-gray-600">
                                  {myBusRoute.timings.start} - {myBusRoute.timings.end}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">
                              Co-passengers ({myBusRoute.coPassengers?.length || 0})
                            </h4>
                            {myBusRoute.coPassengers && myBusRoute.coPassengers.length > 0 ? (
                              <div className="space-y-2">
                                {myBusRoute.coPassengers.slice(0, 3).map((passenger: any, index: number) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={passenger.profileImage} />
                                      <AvatarFallback className="text-xs">
                                        {passenger.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-blue-800">{passenger.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {passenger.role}
                                    </Badge>
                                  </div>
                                ))}
                                {myBusRoute.coPassengers.length > 3 && (
                                  <p className="text-xs text-blue-600">
                                    +{myBusRoute.coPassengers.length - 3} more passengers
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-blue-700">No other passengers yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Tracking */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-red-600" />
                        Live Location
                        <Badge variant="outline" className="ml-auto">
                          🔴 Live
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {myBusRoute.gpsLiveLink ? (
                        <div className="space-y-4">
                          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 mb-4">Google Maps Integration</p>
                              <Button
                                onClick={() => window.open(myBusRoute.gpsLiveLink, "_blank")}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Navigation className="h-4 w-4 mr-2" />
                                Open in Google Maps
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant="outline"
                              onClick={() => window.open(myBusRoute.gpsLiveLink, "_blank")}
                              className="w-full"
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              Track Live
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full"
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Report Issue
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">GPS tracking not available for this bus</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Bus Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bus Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      On Route
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Next Stop</span>
                    <span className="text-sm font-medium">College Gate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ETA</span>
                    <span className="text-sm font-medium">15 mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm text-gray-500">2 mins ago</span>
                  </div>
                </CardContent>
              </Card>

              {/* All Bus Routes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">All Bus Routes</CardTitle>
                </CardHeader>
                <CardContent>
                  {allBusesLoading ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allBusRoutes.slice(0, 5).map((route: any) => (
                        <div key={route.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {route.id}
                              </p>
                              <p className="text-xs text-gray-600">{route.route}</p>
                            </div>
                            <Badge
                              variant={route.isActive ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {route.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Driver
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    View Co-passengers
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule Change
                  </Button>
                </CardContent>
              </Card>

              {/* Safety Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🚌 Safety Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    • Always board from designated stops
                  </p>
                  <p className="text-sm text-gray-600">
                    • Keep emergency contact numbers handy
                  </p>
                  <p className="text-sm text-gray-600">
                    • Report any safety concerns immediately
                  </p>
                  <p className="text-sm text-gray-600">
                    • Follow bus timing schedules
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
