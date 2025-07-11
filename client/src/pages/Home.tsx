import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useLocation } from "wouter";
import { useEffect } from "react";
import {
  Brain,
  MessageSquare,
  Users,
  Briefcase,
  Search,
  Bus,
  Linkedin,
  Bell,
  CheckCircle,
  Shield,
  Smartphone,
  Twitter,
  Github,
  Instagram,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const features = [
    {
      id: "ask-knowzone",
      title: "Ask KnowZone",
      description: "Get instant AI-powered answers to your academic and career questions using Google's Gemini 2.5 API",
      icon: Brain,
      gradient: "from-blue-500 to-blue-600",
      color: "text-blue-600",
      action: "Try Gemini AI",
    },
    {
      id: "forums",
      title: "Multi-College Forums",
      description: "Connect across VTU, Autonomous, and All-India forums. Share knowledge and build networks nationwide",
      icon: MessageSquare,
      gradient: "from-green-500 to-green-600",
      color: "text-green-600",
      action: "Join Discussions",
    },
    {
      id: "mentor-connect",
      title: "MentorConnect",
      description: "Ask questions to seniors and faculty anonymously or publicly. Get guidance from experienced mentors",
      icon: Users,
      gradient: "from-red-500 to-red-600",
      color: "text-red-600",
      action: "Find Mentors",
    },
    {
      id: "opportunities",
      title: "Opportunities Board",
      description: "Discover internships, hackathons, and events with smart filtering based on your interests and skills",
      icon: Briefcase,
      gradient: "from-yellow-500 to-yellow-600",
      color: "text-yellow-600",
      action: "Explore Opportunities",
    },
    {
      id: "bus-tracker",
      title: "Smart Bus Tracker",
      description: "Track your college bus in real-time with Google Maps integration. See co-passengers and route updates",
      icon: Bus,
      gradient: "from-blue-500 to-indigo-500",
      color: "text-blue-600",
      action: "Track Bus",
    },
    {
      id: "linkedin",
      title: "Professional Network",
      description: "Connect with alumni and professionals on LinkedIn. Build your network across colleges and industries",
      icon: Linkedin,
      gradient: "from-purple-500 to-pink-500",
      color: "text-purple-600",
      action: "Build Network",
    },
  ];

  const forums = [
    {
      title: "My College Forum",
      description: "Connect with students and faculty from your own college. Share resources, ask questions, and build local networks.",
      icon: "🏫",
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      action: "Join College Forum",
    },
    {
      title: "Regional Circle",
      description: "Join VTU Forum, Autonomous Forum, or regional groups. Connect with similar curriculum and share exam strategies.",
      icon: "📍",
      gradient: "from-green-50 to-green-100",
      border: "border-green-200",
      buttonColor: "bg-green-600 hover:bg-green-700",
      action: "Join Regional Circle",
    },
    {
      title: "All India Forum",
      description: "Connect with students across India. Share opportunities, discuss industry trends, and build a national network.",
      icon: "🌍",
      gradient: "from-red-50 to-red-100",
      border: "border-red-200",
      buttonColor: "bg-red-600 hover:bg-red-700",
      action: "Join All India Forum",
    },
  ];

  const technologies = [
    { name: "Firebase Studio", description: "No-code development platform for rapid prototyping", icon: "🔥" },
    { name: "Gemini 2.5 API", description: "Advanced AI for intelligent Q&A and recommendations", icon: "🧠" },
    { name: "Firestore", description: "Real-time NoSQL database for seamless data sync", icon: "💾" },
    { name: "Google Maps", description: "Real-time bus tracking and location services", icon: "🗺️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-red-400 rounded-full opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400 rounded-full opacity-20 animate-float" style={{ animationDelay: "4s" }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-slide-up">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <span className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
                  🚀 Powered by Google AI
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text block">KnowZone</span>
                <span className="text-white block">India's AI-Powered</span>
                <span className="text-blue-100 block">Student Platform</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                "India's AI-Powered Platform to Ask, Connect, Discover & Grow – Built with Google."
                <br /><br />
                "Uniting India's Students, Alumni & Faculty Through the Power of Google AI."
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                  size="lg"
                >
                  🚀 Start Your Journey
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all"
                  size="lg"
                >
                  ▶️ Watch Demo
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-blue-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🔥</span>
                  <span>Firebase Studio</span>
                </div>
                <div className="flex items-center">
                  <Brain className="text-2xl mr-2" />
                  <span>Gemini AI</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🗺️</span>
                  <span>Google Maps</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="College students collaborating with technology" 
                className="rounded-2xl shadow-2xl w-full" 
              />
              
              {/* Floating cards */}
              <div className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-lg animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="text-white text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">AI Chat Active</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg animate-float" style={{ animationDelay: "2s" }}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Users className="text-white text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">50K+ Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powered by Google Technologies</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of education with AI-powered features built on Google's cutting-edge platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100 cursor-pointer"
                  onClick={() => setAuthModalOpen(true)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className={`flex items-center ${feature.color} font-medium`}>
                    <span>{feature.action}</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Experience the Dashboard</h2>
            <p className="text-xl text-gray-600">Role-based interfaces for Students, Alumni, and Faculty</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Student profile" 
                    className="w-12 h-12 rounded-full border-2 border-white" 
                  />
                  <div>
                    <h3 className="text-lg font-semibold">Arjun Patel</h3>
                    <p className="text-blue-100">VIT University, Vellore</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <Bell className="text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="p-8">
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                  {/* AI Assistant Preview */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <Brain className="text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Ask KnowZone AI</h4>
                    </div>
                    <div className="bg-white rounded-xl p-4 mb-4">
                      <p className="text-gray-600 mb-2">💬 "What are the best programming languages to learn for AI/ML in 2024?"</p>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          <strong>KnowZone AI:</strong> Based on current industry trends and your CSE background, I recommend starting with Python for its extensive ML libraries like TensorFlow and PyTorch...
                        </p>
                      </div>
                    </div>
                    <Button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700">
                      ➕ Ask New Question
                    </Button>
                  </div>
                  
                  {/* Recent Forum Activity */}
                  <div className="bg-white rounded-2xl border border-gray-200">
                    <div className="border-b border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900">Recent Forum Activity</h4>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50" 
                          alt="Forum user" 
                          className="w-10 h-10 rounded-full" 
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">Priya Sharma</span>
                            <span className="text-sm text-gray-500">VTU Forum</span>
                            <span className="text-sm text-gray-400">2 hours ago</span>
                          </div>
                          <p className="text-gray-700">Best resources for Data Structures preparation for VTU 3rd sem exam?</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>👍 12</span>
                            <span>💬 8 replies</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Questions Asked</span>
                        <span className="font-semibold text-blue-600">23</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Answers Given</span>
                        <span className="font-semibold text-green-600">45</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Network Size</span>
                        <span className="font-semibold text-red-600">127</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Upcoming Events */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm font-medium text-gray-900">GDG DevFest 2024</p>
                        <p className="text-xs text-gray-600">Tomorrow, 10:00 AM</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-gray-900">AI/ML Workshop</p>
                        <p className="text-xs text-gray-600">Dec 28, 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-College Forums */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Connect Across India</h2>
            <p className="text-xl text-gray-600">Join forums based on your college type and connect with students nationwide</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {forums.map((forum, index) => (
              <div key={index} className={`bg-gradient-to-br ${forum.gradient} rounded-2xl p-8 border ${forum.border}`}>
                <div className="text-4xl mb-4">{forum.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{forum.title}</h3>
                <p className="text-gray-700 mb-6">{forum.description}</p>
                <img 
                  src={`https://images.unsplash.com/photo-${index === 0 ? '1523240795612-9a054b0db644' : index === 1 ? '1517486808906-6ca8b3f04846' : '1556075798-4825dfaaf498'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200`}
                  alt={forum.title}
                  className="rounded-xl mb-4 w-full h-32 object-cover" 
                />
                <Button 
                  onClick={() => setAuthModalOpen(true)}
                  className={`${forum.buttonColor} text-white px-6 py-3 rounded-full font-medium w-full transition-colors`}
                >
                  {forum.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Technology Showcase */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built with Google's Best</h2>
            <p className="text-xl text-blue-200">Leveraging Google's cutting-edge technologies for the ultimate student experience</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white bg-opacity-10 rounded-2xl p-6 text-center backdrop-blur-sm">
                <div className="text-4xl mb-4">{tech.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{tech.name}</h3>
                <p className="text-blue-200 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="bg-white bg-opacity-10 rounded-3xl p-8 backdrop-blur-sm inline-block">
              <h3 className="text-2xl font-bold mb-4">Why Google Technologies?</h3>
              <p className="text-blue-200 max-w-3xl">
                "Google's ecosystem provides unmatched scalability, reliability, and innovation. From Firebase's rapid development to Gemini's AI capabilities, every component is designed to deliver exceptional user experiences. Our platform showcases the power of Google's integrated solutions for education technology."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Student Experience?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students, alumni, and faculty already using KnowZone to connect, learn, and grow together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={() => setAuthModalOpen(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              size="lg"
            >
              🎓 Join as Student/Alumni
            </Button>
            <Button
              onClick={() => setAuthModalOpen(true)}
              variant="outline"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all"
              size="lg"
            >
              👨‍🏫 Join as Faculty
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-blue-200">
            <div className="flex items-center">
              <CheckCircle className="mr-2" />
              <span>Free to Use</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-2" />
              <span>Secure with Firebase</span>
            </div>
            <div className="flex items-center">
              <Smartphone className="mr-2" />
              <span>Mobile Responsive</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  🎓
                </div>
                <div>
                  <h3 className="text-xl font-bold">KnowZone</h3>
                  <p className="text-sm text-gray-400">Built with Google</p>
                </div>
              </div>
              <p className="text-gray-400">India's AI-Powered Platform to Ask, Connect, Discover & Grow</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Ask KnowZone AI</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Multi-College Forums</a></li>
                <li><a href="#" className="hover:text-white transition-colors">MentorConnect</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bus Tracker</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Technologies</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Firebase Studio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gemini AI</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Firestore</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Google Maps</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="text-xl" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 KnowZone. Built with ❤️ using Google Technologies for GDG Community.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
