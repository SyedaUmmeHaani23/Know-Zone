import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Share2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ForumPostProps {
  post: {
    id: number;
    title: string;
    body: string;
    forumName: string;
    tags?: string[];
    likes: number;
    replies: number;
    isAnonymous: boolean;
    createdAt: string;
    author?: {
      id: number;
      name: string;
      role: string;
      department: string;
      profileImage?: string;
    };
  };
}

export function ForumPost({ post }: ForumPostProps) {
  const { getIdToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);

  const likeMutation = useMutation({
    mutationFn: async () => {
      const token = await getIdToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`/api/forums/posts/${post.id}/like`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      return response.json();
    },
    onSuccess: () => {
      setIsLiked(true);
      queryClient.invalidateQueries({
        queryKey: ["/api/forums", post.forumName, "posts"],
      });
    },
    onError: (error) => {
      console.error("Like error:", error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    if (!isLiked) {
      likeMutation.mutate();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.body,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Post link copied to clipboard",
      });
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Author Info */}
        <div className="flex items-start space-x-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author?.profileImage} />
            <AvatarFallback>
              {post.isAnonymous ? "?" : post.author?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">
                {post.isAnonymous ? "Anonymous" : post.author?.name}
              </h4>
              {!post.isAnonymous && post.author && (
                <>
                  <Badge variant="secondary" className="text-xs">
                    {post.author.role}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {post.author.department}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {post.title}
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {post.body}
          </p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={`flex items-center space-x-1 ${
              isLiked ? "text-red-600" : "text-gray-600"
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{post.likes + (isLiked ? 1 : 0)}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-gray-600"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.replies}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center space-x-1 text-gray-600"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
