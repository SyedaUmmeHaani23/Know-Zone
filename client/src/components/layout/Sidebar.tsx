import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Brain,
  MessageSquare,
  Users,
  Briefcase,
  Search,
  Bus,
  Linkedin,
  BarChart3,
  Home,
  GraduationCap,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Ask KnowZone", href: "/ask", icon: Brain },
  { name: "Forums", href: "/forums", icon: MessageSquare },
  { name: "MentorConnect", href: "/mentor", icon: Users },
  { name: "Opportunities", href: "/opportunities", icon: Briefcase },
  { name: "Lost & Found", href: "/lost-found", icon: Search },
  { name: "Bus Tracker", href: "/bus", icon: Bus },
  { name: "LinkedIn", href: "/linkedin", icon: Linkedin },
];

const facultyNavigation = [
  { name: "Faculty Dashboard", href: "/faculty", icon: BarChart3 },
  { name: "Student Questions", href: "/faculty/questions", icon: MessageSquare },
  { name: "Resources", href: "/faculty/resources", icon: GraduationCap },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const mainNav = user.role === "faculty" ? [...navigation, ...facultyNavigation] : navigation;

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors",
                    location === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
