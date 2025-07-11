import { Sidebar } from "@/components/layout/Sidebar";
import { GeminiChat } from "@/components/chat/GeminiChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Zap, BookOpen, Briefcase, Code } from "lucide-react";

export default function AskKnowZone() {
  const suggestions = [
    {
      category: "Academic",
      icon: BookOpen,
      color: "bg-blue-500",
      questions: [
        "Explain data structures and algorithms for beginners",
        "Best resources for learning machine learning",
        "How to prepare for VTU exams effectively",
        "Difference between computer science and IT",
      ],
    },
    {
      category: "Career",
      icon: Briefcase,
      color: "bg-green-500",
      questions: [
        "Career paths after CSE degree",
        "How to prepare for software engineering interviews",
        "Skills needed for data scientist role",
        "Best companies for freshers in Bangalore",
      ],
    },
    {
      category: "Technical",
      icon: Code,
      color: "bg-purple-500",
      questions: [
        "Difference between React and Angular",
        "How to learn cloud computing",
        "Best programming languages for AI/ML",
        "Web development roadmap for beginners",
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="hidden md:block border-r bg-white" />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Ask KnowZone</h1>
                <p className="text-gray-600">AI-powered assistant for all your academic and career questions</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Powered by Gemini 2.5
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-time AI
                </Badge>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-gray-700">
                <strong>✨ Pro Tip:</strong> Ask specific questions for better responses. Include your field of study, year, or context for personalized advice.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <GeminiChat />
            </div>

            {/* Sidebar with suggestions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      🎓
                    </div>
                    <span className="text-sm">Academic guidance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      💼
                    </div>
                    <span className="text-sm">Career counseling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      💻
                    </div>
                    <span className="text-sm">Technical explanations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      📚
                    </div>
                    <span className="text-sm">Study strategies</span>
                  </div>
                </CardContent>
              </Card>

              {/* Question Suggestions */}
              {suggestions.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.category}>
                    <CardHeader>
                      <CardTitle className="flex items-center text-sm">
                        <div className={`w-6 h-6 ${category.color} rounded-lg flex items-center justify-center mr-2`}>
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                        {category.category} Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.questions.map((question, index) => (
                          <button
                            key={index}
                            className="w-full text-left p-2 text-xs bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              // This would trigger the chat input
                              const event = new CustomEvent('askQuestion', { detail: question });
                              window.dispatchEvent(event);
                            }}
                          >
                            "{question}"
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Usage Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Your AI Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Questions asked</span>
                      <span className="font-semibold">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This month</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. response time</span>
                      <span className="font-semibold">2.3s</span>
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
