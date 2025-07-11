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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Upload,
  Download,
  Eye,
  Reply
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const answerSchema = z.object({
  answer: z.string().min(1, "Answer is required"),
});

type AnswerFormData = z.infer<typeof answerSchema>;

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["document", "link", "video", "announcement"]),
  content: z.string().min(1, "Content is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

export default function FacultyDashboard() {
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [createResourceOpen, setCreateResourceOpen] = useState(false);

  const { data: pendingQuestions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["/api/questions", { targetRole: "faculty" }],
  });

  const { data: studentQuestions = [] } = useQuery({
    queryKey: ["/api/questions", { targetRole: "any" }],
  });

  const { data: myAnswers = [] } = useQuery({
    queryKey: ["/api/questions/my-answers"],
  });

  const {
    register: registerAnswer,
    handleSubmit: handleSubmitAnswer,
    formState: { errors: answerErrors },
    reset: resetAnswer,
  } = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
  });

  const {
    register: registerResource,
    handleSubmit: handleSubmitResource,
    formState: { errors: resourceErrors },
    reset: resetResource,
    setValue: setResourceValue,
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
  });

  const createAnswerMutation = useMutation({
    mutationFn: async (data: AnswerFormData) => {
      const token = await getIdToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`/api/questions/${selectedQuestion.id}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create answer");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Answer posted successfully!",
        description: "Your answer has been published and will help the student.",
      });
      setAnswerModalOpen(false);
      resetAnswer();
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
    },
    onError: (error) => {
      console.error("Create answer error:", error);
      toast({
        title: "Error posting answer",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const createResourceMutation = useMutation({
    mutationFn: async (data: ResourceFormData) => {
      const token = await getIdToken();
      if (!token) throw new Error("Authentication required");

      // This would typically post to a faculty resources endpoint
      // For now, we'll simulate it
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1000);
      });
    },
    onSuccess: () => {
      toast({
        title: "Resource shared successfully!",
        description: "Your resource has been published and is now available to students.",
      });
      setCreateResourceOpen(false);
      resetResource();
    },
    onError: (error) => {
      console.error("Create resource error:", error);
      toast({
        title: "Error sharing resource",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmitAnswer = (data: AnswerFormData) => {
    createAnswerMutation.mutate(data);
  };

  const onSubmitResource = (data: ResourceFormData) => {
    createResourceMutation.mutate(data);
  };

  const handleAnswerQuestion = (question: any) => {
    setSelectedQuestion(question);
    setAnswerModalOpen(true);
  };

  if (!user || user.role !== "faculty") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to faculty members.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Questions Answered",
      value: myAnswers.length.toString(),
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Pending Questions",
      value: pendingQuestions.filter((q: any) => !q.isAnswered).length.toString(),
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Total Students Helped",
      value: "127",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Resources Shared",
      value: "24",
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Dashboard</h1>
                <p className="text-gray-600">
                  Welcome, Dr. {user.name}! Manage student interactions and share resources.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setCreateResourceOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Share Resource
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="questions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="questions">Student Questions</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Questions Tab */}
            <TabsContent value="questions" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Pending Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Questions for Faculty</span>
                      <Badge className="bg-orange-100 text-orange-800">
                        {pendingQuestions.filter((q: any) => !q.isAnswered).length} Pending
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {questionsLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner size="lg" />
                      </div>
                    ) : pendingQuestions.length === 0 ? (
                      <EmptyState
                        icon={<MessageSquare className="h-8 w-8" />}
                        title="No Questions"
                        description="No students have asked questions yet."
                      />
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {pendingQuestions.map((question: any) => (
                          <div key={question.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 line-clamp-1">
                                {question.title}
                              </h4>
                              {question.isAnswered ? (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Answered
                                </Badge>
                              ) : (
                                <Badge className="bg-orange-100 text-orange-800 text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {question.body}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              
                              {!question.isAnswered && (
                                <Button
                                  size="sm"
                                  onClick={() => handleAnswerQuestion(question)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Reply className="h-3 w-3 mr-1" />
                                  Answer
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* General Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle>All Student Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {studentQuestions.slice(0, 5).map((question: any) => (
                        <div key={question.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 line-clamp-1">
                              {question.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {question.targetRole}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {question.body}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              {question.answerCount} answers
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAnswerQuestion(question)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>My Shared Resources</span>
                        <Button
                          onClick={() => setCreateResourceOpen(true)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Resource
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Sample resources */}
                        {[
                          {
                            title: "Data Structures and Algorithms - Complete Guide",
                            type: "document",
                            downloads: 142,
                            date: "2 days ago",
                          },
                          {
                            title: "Important Questions for VTU Exam",
                            type: "document",
                            downloads: 89,
                            date: "1 week ago",
                          },
                          {
                            title: "Machine Learning Tutorial Videos",
                            type: "video",
                            downloads: 234,
                            date: "2 weeks ago",
                          },
                        ].map((resource, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {resource.title}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <Badge variant="outline" className="text-xs">
                                    {resource.type}
                                  </Badge>
                                  <span>{resource.downloads} downloads</span>
                                  <span>{resource.date}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resource Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Resources</span>
                        <span className="font-semibold">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Downloads</span>
                        <span className="font-semibold text-blue-600">1,247</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Month</span>
                        <span className="font-semibold text-green-600">89</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg. Rating</span>
                        <span className="font-semibold text-yellow-600">4.7/5</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Engagement analytics would appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { topic: "Data Structures", count: 45 },
                        { topic: "Machine Learning", count: 38 },
                        { topic: "Web Development", count: 32 },
                        { topic: "Database Management", count: 28 },
                        { topic: "Career Guidance", count: 24 },
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">{item.topic}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(item.count / 45) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Answer Question Modal */}
      <Dialog open={answerModalOpen} onOpenChange={setAnswerModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Answer Student Question</DialogTitle>
          </DialogHeader>

          {selectedQuestion && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {selectedQuestion.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{selectedQuestion.body}</p>
                  
                  {selectedQuestion.tags && selectedQuestion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedQuestion.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <form onSubmit={handleSubmitAnswer(onSubmitAnswer)} className="space-y-4">
                <div>
                  <Label htmlFor="answer">Your Answer</Label>
                  <Textarea
                    id="answer"
                    {...registerAnswer("answer")}
                    placeholder="Share your knowledge and help this student..."
                    rows={6}
                    error={answerErrors.answer?.message}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAnswerModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createAnswerMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createAnswerMutation.isPending ? "Posting..." : "Post Answer"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Resource Modal */}
      <Dialog open={createResourceOpen} onOpenChange={setCreateResourceOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share New Resource</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitResource(onSubmitResource)} className="space-y-4">
            <div>
              <Label htmlFor="title">Resource Title</Label>
              <Input
                id="title"
                {...registerResource("title")}
                placeholder="e.g., Data Structures Complete Notes"
                error={resourceErrors.title?.message}
              />
            </div>

            <div>
              <Label htmlFor="type">Resource Type</Label>
              <Select onValueChange={(value) => setResourceValue("type", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document/PDF</SelectItem>
                  <SelectItem value="link">External Link</SelectItem>
                  <SelectItem value="video">Video Content</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
              {resourceErrors.type && (
                <p className="text-sm text-red-600 mt-1">{resourceErrors.type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                {...registerResource("targetAudience")}
                placeholder="e.g., 3rd Semester CSE, All Students"
                error={resourceErrors.targetAudience?.message}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...registerResource("description")}
                placeholder="Describe what this resource contains and how it will help students..."
                rows={3}
                error={resourceErrors.description?.message}
              />
            </div>

            <div>
              <Label htmlFor="content">Content/Link</Label>
              <Textarea
                id="content"
                {...registerResource("content")}
                placeholder="Paste content, link, or upload file..."
                rows={4}
                error={resourceErrors.content?.message}
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload files (optional)</p>
              <Button type="button" variant="outline" size="sm">
                Choose Files
              </Button>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateResourceOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createResourceMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {createResourceMutation.isPending ? "Sharing..." : "Share Resource"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
