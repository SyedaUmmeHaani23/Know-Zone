import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function GeminiChat() {
  const { getIdToken } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm KnowZone AI, powered by Google's Gemini. I'm here to help you with academic questions, career guidance, and anything related to your educational journey. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: inputMessage,
          context: "Educational assistant for Indian college students",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });

      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span>KnowZone AI Assistant</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Powered by Gemini
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex space-x-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === "user" ? "text-blue-200" : "text-gray-500"
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex space-x-3 justify-start">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about academics, career, or college life..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Powered by Google Gemini AI. Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </Card>
  );
}
