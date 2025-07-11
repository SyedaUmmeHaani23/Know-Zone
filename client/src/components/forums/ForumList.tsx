import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ForumPost } from "./ForumPost";
import { MessageSquare, Plus, Users, Globe, School } from "lucide-react";

interface ForumListProps {
  selectedForum: string;
  onCreatePost: () => void;
}

export function ForumList({ selectedForum, onCreatePost }: ForumListProps) {
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ["/api/forums", selectedForum, "posts"],
    enabled: !!selectedForum,
  });

  const getForumIcon = (forumName: string) => {
    if (forumName.includes("College")) return <School className="h-5 w-5" />;
    if (forumName.includes("All India")) return <Globe className="h-5 w-5" />;
    return <Users className="h-5 w-5" />;
  };

  const getForumDescription = (forumName: string) => {
    if (forumName.includes("College")) {
      return "Connect with students and faculty from your college";
    }
    if (forumName.includes("All India")) {
      return "Discuss with students from across India";
    }
    if (forumName.includes("VTU")) {
      return "VTU affiliated colleges discussion";
    }
    return "Regional forum for your college group";
  };

  if (!selectedForum) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-12 w-12" />}
        title="Select a Forum"
        description="Choose a forum from the sidebar to view and participate in discussions."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-12 w-12" />}
        title="Error Loading Posts"
        description="Failed to load forum posts. Please try again later."
        action={
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Forum Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {getForumIcon(selectedForum)}
              </div>
              <div>
                <CardTitle className="text-xl">{selectedForum}</CardTitle>
                <p className="text-sm text-gray-600">
                  {getForumDescription(selectedForum)}
                </p>
              </div>
            </div>
            <Button onClick={onCreatePost} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Posts */}
      {posts.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-12 w-12" />}
          title="No Posts Yet"
          description="Be the first to start a discussion in this forum!"
          action={
            <Button onClick={onCreatePost} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create First Post
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <ForumPost key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
