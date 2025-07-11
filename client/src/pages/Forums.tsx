import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { ForumList } from "@/components/forums/ForumList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Users, Globe, School, Plus } from "lucide-react";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

type PostFormData = z.infer<typeof postSchema>;

export default function Forums() {
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedForum, setSelectedForum] = useState<string>("");
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const { data: colleges = [] } = useQuery({
    queryKey: ["/api/colleges"],
  });

  const userCollege = colleges.find((college: any) => college.id === user?.collegeId);

  const forums = [
    {
      id: "my-college",
      name: `${userCollege?.name || "My College"} Forum`,
      description: "Connect with students and faculty from your college",
      icon: School,
      color: "bg-blue-500",
      memberCount: "1.2K",
    },
    {
      id: userCollege?.type === "VTU" ? "vtu-forum" : "autonomous-forum",
      name: userCollege?.type === "VTU" ? "VTU Forum" : "Autonomous Forum",
      description: userCollege?.type === "VTU" 
        ? "Connect with VTU affiliated colleges" 
        : "Connect with autonomous colleges",
      icon: Users,
      color: "bg-green-500",
      memberCount: "15K",
    },
    {
      id: "all-india",
      name: "All India Forum",
      description: "Connect with students from across India",
      icon: Globe,
      color: "bg-red-500",
      memberCount: "50K",
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const token = await getIdToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch("/api/forums/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          forumName: selectedForum,
          tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post created successfully!",
        description: "Your post has been published to the forum.",
      });
      setCreatePostOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["/api/forums", selectedForum, "posts"],
      });
    },
    onError: (error) => {
      console.error("Create post error:", error);
      toast({
        title: "Error creating post",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PostFormData) => {
    createPostMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="hidden md:block border-r bg-white" />
      
      <div className="flex-1 flex">
        {/* Forum Sidebar */}
        <div className="w-80 bg-white border-r p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Forums</h2>
            <p className="text-gray-600">Connect with students across colleges</p>
          </div>

          <div className="space-y-4">
            {forums.map((forum) => {
              const Icon = forum.icon;
              return (
                <Card
                  key={forum.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedForum === forum.name
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setSelectedForum(forum.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${forum.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{forum.name}</h3>
                        <p className="text-sm text-gray-600">{forum.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {forum.memberCount} members
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Forum Guidelines */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Forum Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-gray-600">• Be respectful and constructive</p>
              <p className="text-xs text-gray-600">• Stay relevant to the topic</p>
              <p className="text-xs text-gray-600">• No spam or promotional content</p>
              <p className="text-xs text-gray-600">• Help others learn and grow</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <ForumList
            selectedForum={selectedForum}
            onCreatePost={() => setCreatePostOpen(true)}
          />
        </div>
      </div>

      {/* Create Post Modal */}
      <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Post in {selectedForum}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="What's your question or topic?"
                error={errors.title?.message}
              />
            </div>

            <div>
              <Label htmlFor="body">Content</Label>
              <Textarea
                id="body"
                {...register("body")}
                placeholder="Share your thoughts, ask questions, or provide helpful information..."
                rows={6}
                error={errors.body?.message}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="e.g., programming, career, interview, vtu"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAnonymous"
                {...register("isAnonymous")}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isAnonymous" className="text-sm">
                Post anonymously
              </Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreatePostOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPostMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createPostMutation.isPending ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
