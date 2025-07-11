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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, MessageCircle, Clock, ThumbsUp, Plus, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const questionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Question details are required"),
  targetRole: z.enum(["senior", "faculty", "any"]),
  isAnonymous: z.boolean().default(false),
  tags: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

const answerSchema = z.object({
  answer: z.string().min(1, "Answer is required"),
});

type AnswerFormData = z.infer<typeof answerSchema>;

export default function MentorConnect() {
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [askQuestionOpen, setAskQuestionOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [viewAnswersOpen, setViewAnswersOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<string>("any");

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["/api/questions", { targetRole }],
  });

  const { data: answers = [] } = useQuery({
    queryKey: ["/api/questions", selectedQuestion?.id, "answers"],
    enabled: !!selectedQuestion,
  });

  const {
    register: registerQuestion,
    handleSubmit: handleSubmitQuestion,
    formState: { errors: questionErrors },
    reset: resetQuestion,
    setValue: setQuestionValue,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const {
    register: registerAnswer,
    handleSubmit: handleSubmitAnswer,
    formState: { errors: answerErrors },
    reset: resetAnswer,
  } = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: QuestionFormData) => {
      const token = await getIdToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create question");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Question posted successfully!",
        description: "Your question has been published and mentors will be able to answer it.",
      });
      setAskQuestionOpen(false);
      resetQuestion();
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
    },
    onError: (error) => {
      console.error("Create question error:", error);
      toast({
        title: "Error posting question",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
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
        description: "Your answer has been published and will help the questioner.",
      });
      resetAnswer();
      queryClient.invalidateQueries({
        queryKey: ["/api/questions", selectedQuestion.id, "answers"],
      });
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

  const onSubmitQuestion = (data: QuestionFormData) => {
    createQuestionMutation.mutate(data);
  };

  const onSubmitAnswer = (data: AnswerFormData) => {
    createAnswerMutation.mutate(data);
  };

  const handleViewAnswers = (question: any) => {
    setSelectedQuestion(question);
    setViewAnswersOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="hidden md:block border-r bg-white" />
      
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">MentorConnect</h1>
                <p className="text-gray-600">
                  Ask questions to seniors and faculty, or help others by sharing your knowledge
                </p>
              </div>
              <Button
                onClick={() => setAskQuestionOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            </div>

            {/* Filter */}
            <div className="mt-6 flex items-center space-x-4">
              <Label htmlFor="targetRole">Filter by target audience:</Label>
              <Select value={targetRole} onValueChange={setTargetRole}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">All Questions</SelectItem>
                  <SelectItem value="senior">For Seniors</SelectItem>
                  <SelectItem value="faculty">For Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Questions List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : questions.length === 0 ? (
            <EmptyState
              icon={<Users className="h-12 w-12" />}
              title="No Questions Yet"
              description="Be the first to ask a question and get help from mentors!"
              action={
                <Button
                  onClick={() => setAskQuestionOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ask First Question
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {questions.map((question: any) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={question.asker?.profileImage} />
                        <AvatarFallback>
                          {question.isAnonymous ? "?" : question.asker?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {question.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            For {question.targetRole}
                          </Badge>
                          {question.isAnswered && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Answered
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            {question.isAnonymous ? "Anonymous" : question.asker?.name}
                          </span>
                          {!question.isAnonymous && question.asker && (
                            <>
                              <Badge variant="secondary" className="text-xs">
                                {question.asker.role}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {question.asker.department}
                              </span>
                            </>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {question.body}
                        </p>
                        
                        {question.tags && question.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {question.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 text-gray-600"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{question.upvotes}</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAnswers(question)}
                            className="flex items-center space-x-1 text-gray-600"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View {question.answerCount} answers</span>
                          </Button>
                          
                          {(user?.role === "faculty" || user?.role === "alumni") && (
                            <Button
                              size="sm"
                              onClick={() => handleViewAnswers(question)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Answer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ask Question Modal */}
      <Dialog open={askQuestionOpen} onOpenChange={setAskQuestionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitQuestion(onSubmitQuestion)} className="space-y-4">
            <div>
              <Label htmlFor="title">Question Title</Label>
              <Input
                id="title"
                {...registerQuestion("title")}
                placeholder="What's your question?"
                error={questionErrors.title?.message}
              />
            </div>

            <div>
              <Label htmlFor="body">Question Details</Label>
              <Textarea
                id="body"
                {...registerQuestion("body")}
                placeholder="Provide more details about your question..."
                rows={6}
                error={questionErrors.body?.message}
              />
            </div>

            <div>
              <Label htmlFor="targetRole">Who should answer this?</Label>
              <Select onValueChange={(value) => setQuestionValue("targetRole", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Anyone</SelectItem>
                  <SelectItem value="senior">Seniors/Alumni</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                </SelectContent>
              </Select>
              {questionErrors.targetRole && (
                <p className="text-sm text-red-600 mt-1">{questionErrors.targetRole.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                {...registerQuestion("tags")}
                placeholder="e.g., career, programming, interview"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAnonymous"
                {...registerQuestion("isAnonymous")}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isAnonymous" className="text-sm">
                Ask anonymously
              </Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAskQuestionOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createQuestionMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createQuestionMutation.isPending ? "Posting..." : "Post Question"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Answers Modal */}
      <Dialog open={viewAnswersOpen} onOpenChange={setViewAnswersOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Question & Answers</DialogTitle>
          </DialogHeader>

          {selectedQuestion && (
            <div className="space-y-6">
              {/* Question */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
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

              {/* Answer Form */}
              {(user?.role === "faculty" || user?.role === "alumni") && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitAnswer(onSubmitAnswer)} className="space-y-4">
                      <Textarea
                        {...registerAnswer("answer")}
                        placeholder="Share your knowledge and help this student..."
                        rows={4}
                        error={answerErrors.answer?.message}
                      />
                      <Button
                        type="submit"
                        disabled={createAnswerMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {createAnswerMutation.isPending ? "Posting..." : "Post Answer"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Answers */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">
                  Answers ({answers.length})
                </h4>
                
                {answers.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No answers yet. Be the first to help!
                  </p>
                ) : (
                  answers.map((answer: any) => (
                    <Card key={answer.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={answer.answerer?.profileImage} />
                            <AvatarFallback>
                              {answer.answerer?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-gray-900">
                                {answer.answerer?.name}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {answer.answerer?.role}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {answer.answerer?.department}
                              </span>
                              {answer.isVerified && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-gray-700 mb-3">{answer.answer}</p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-1"
                              >
                                <ThumbsUp className="h-3 w-3" />
                                <span>{answer.upvotes}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
