import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Briefcase, 
  Plus, 
  Calendar, 
  MapPin, 
  Building, 
  Filter,
  ExternalLink,
  Clock,
  Target,
  Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const opportunitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["internship", "hackathon", "event", "job"]),
  company: z.string().optional(),
  location: z.string().optional(),
  deadline: z.string().optional(),
  requirements: z.string().optional(),
  tags: z.string().optional(),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

export default function Opportunities() {
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createOpportunityOpen, setCreateOpportunityOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ["/api/opportunities", { type: typeFilter === "all" ? undefined : typeFilter }],
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ["/api/opportunities/recommendations"],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
  });

  const createOpportunityMutation = useMutation({
    mutationFn: async (data: OpportunityFormData) => {
      const token = await getIdToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          deadline: data.deadline ? new Date(data.deadline) : null,
          requirements: data.requirements ? data.requirements.split(",").map(req => req.trim()) : [],
          tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create opportunity");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Opportunity posted successfully!",
        description: "Your opportunity has been published and is now visible to all users.",
      });
      setCreateOpportunityOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] });
    },
    onError: (error) => {
      console.error("Create opportunity error:", error);
      toast({
        title: "Error posting opportunity",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OpportunityFormData) => {
    createOpportunityMutation.mutate(data);
  };

  const filteredOpportunities = opportunities.filter((opportunity: any) =>
    opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opportunity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opportunity.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "internship": return "💼";
      case "hackathon": return "🏆";
      case "event": return "📅";
      case "job": return "🎯";
      default: return "📋";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "internship": return "bg-blue-100 text-blue-800";
      case "hackathon": return "bg-purple-100 text-purple-800";
      case "event": return "bg-green-100 text-green-800";
      case "job": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Opportunities</h1>
                <p className="text-gray-600">
                  Discover internships, hackathons, events, and job opportunities
                </p>
              </div>
              <Button
                onClick={() => setCreateOpportunityOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post Opportunity
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="internship">Internships</SelectItem>
                    <SelectItem value="hackathon">Hackathons</SelectItem>
                    <SelectItem value="event">Events</SelectItem>
                    <SelectItem value="job">Jobs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* AI Recommendations */}
              {recommendations.length > 0 && (
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                      AI Recommendations for You
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendations.slice(0, 3).map((rec: any, index: number) => (
                        <div key={index} className="p-3 bg-white rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{rec.title}</h4>
                              <p className="text-sm text-gray-600">{rec.reasoning}</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              {rec.relevanceScore}% match
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Opportunities List */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredOpportunities.length === 0 ? (
                <EmptyState
                  icon={<Briefcase className="h-12 w-12" />}
                  title="No Opportunities Found"
                  description={searchQuery ? "Try adjusting your search or filters" : "Be the first to post an opportunity!"}
                  action={
                    <Button
                      onClick={() => setCreateOpportunityOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Post Opportunity
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {filteredOpportunities.map((opportunity: any) => (
                    <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <span className="text-2xl">{getTypeIcon(opportunity.type)}</span>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {opportunity.title}
                                </h3>
                                {opportunity.company && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Building className="h-3 w-3 mr-1" />
                                    {opportunity.company}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-4 line-clamp-3">
                              {opportunity.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge className={getTypeColor(opportunity.type)}>
                                {opportunity.type}
                              </Badge>
                              {opportunity.location && (
                                <Badge variant="outline" className="text-xs">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {opportunity.location}
                                </Badge>
                              )}
                              {opportunity.deadline && (
                                <Badge variant="outline" className="text-xs">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                            
                            {opportunity.requirements && opportunity.requirements.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {opportunity.requirements.slice(0, 3).map((req: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {req}
                                    </Badge>
                                  ))}
                                  {opportunity.requirements.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{opportunity.requirements.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {opportunity.tags && opportunity.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {opportunity.tags.map((tag: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  Posted {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Apply Now
                              </Button>
                            </div>
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
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Opportunity Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Opportunities</span>
                    <span className="font-semibold">{opportunities.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Internships</span>
                    <span className="font-semibold text-blue-600">
                      {opportunities.filter((o: any) => o.type === "internship").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Upcoming Events</span>
                    <span className="font-semibold text-green-600">
                      {opportunities.filter((o: any) => o.type === "event").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hackathons</span>
                    <span className="font-semibold text-purple-600">
                      {opportunities.filter((o: any) => o.type === "hackathon").length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Python", "AI/ML", "Full-Stack", "Data Science", "Cloud"].map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💡 Tips for Success</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    • Update your profile regularly to get better AI recommendations
                  </p>
                  <p className="text-sm text-gray-600">
                    • Apply early to increase your chances
                  </p>
                  <p className="text-sm text-gray-600">
                    • Network with professionals on LinkedIn
                  </p>
                  <p className="text-sm text-gray-600">
                    • Prepare your resume and portfolio
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Create Opportunity Modal */}
      <Dialog open={createOpportunityOpen} onOpenChange={setCreateOpportunityOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post New Opportunity</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Software Development Internship at Google"
                error={errors.title?.message}
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => setValue("type", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select opportunity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="job">Job</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  {...register("company")}
                  placeholder="e.g., Google, Microsoft"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g., Bangalore, Remote"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe the opportunity, responsibilities, and what makes it great..."
                rows={4}
                error={errors.description?.message}
              />
            </div>

            <div>
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                type="date"
                {...register("deadline")}
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (comma-separated)</Label>
              <Input
                id="requirements"
                {...register("requirements")}
                placeholder="e.g., React, Node.js, 2+ years experience"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="e.g., frontend, backend, internship"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpportunityOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createOpportunityMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createOpportunityMutation.isPending ? "Publishing..." : "Publish Opportunity"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
