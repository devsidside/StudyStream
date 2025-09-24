import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import QuickActionCard from "@/components/common/QuickActionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Search, 
  Map, 
  BookMarked, 
  Calendar, 
  MessageCircle, 
  Users, 
  Settings, 
  HelpCircle,
  BookOpen,
  GraduationCap,
  Building,
  Coffee,
  PartyPopper,
  Bus,
  Star,
  Clock,
  Navigation,
  Bell,
  Menu
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const quickActions = [
    { icon: BookOpen, title: "Find Library", description: "Study spaces near you", color: "bg-blue-500" },
    { icon: GraduationCap, title: "Book Tutor", description: "Get academic help", color: "bg-purple-500" },
    { icon: Building, title: "Browse Hostels", description: "Find accommodation", color: "bg-green-500" },
    { icon: PartyPopper, title: "Events", description: "Campus activities", color: "bg-orange-500" },
    { icon: Coffee, title: "Cafes", description: "Food & beverages", color: "bg-yellow-500" },
    { icon: Bus, title: "Transport", description: "Getting around", color: "bg-red-500" },
  ];

  const nearbyServices = [
    {
      name: "Central Library",
      type: "Library",
      rating: 4.8,
      distance: "0.3 mi",
      status: "Open",
      features: ["WiFi", "Study Rooms", "24/7"]
    },
    {
      name: "Math Tutor",
      type: "Tutoring",
      rating: 4.9,
      distance: "0.5 mi",
      status: "Available",
      features: ["Calculus", "Algebra", "Statistics"]
    },
    {
      name: "Green Hostel",
      type: "Accommodation",
      rating: 4.5,
      distance: "0.8 mi",
      status: "Rooms Available",
      features: ["Single Rooms", "WiFi", "Laundry"]
    }
  ];

  const recentActivity = [
    { action: "Reviewed Central Library", time: "2 hrs ago" },
    { action: "Booked Math tutoring", time: "Yesterday" },
    { action: "Saved Green Hostel", time: "2 days ago" }
  ];

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Search, label: "Discover" },
    { icon: Map, label: "Map" },
    { icon: BookMarked, label: "Saved" },
    { icon: Calendar, label: "Events" },
    { icon: MessageCircle, label: "Messages" },
    { icon: Users, label: "Community" },
    { icon: Settings, label: "Settings" },
    { icon: HelpCircle, label: "Help" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              data-testid="button-menu-toggle"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">StudyConnect</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Global Search..."
                className="pl-10"
                data-testid="input-global-search"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" data-testid="button-notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {user?.firstName?.[0] || 'S'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } overflow-hidden`}>
          <div className="p-4">
            {!sidebarCollapsed && (
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-medium">
                      {user?.firstName?.[0] || 'S'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground" data-testid="text-user-name">
                      {user?.firstName || 'Sarah'}
                    </p>
                    <p className="text-sm text-muted-foreground">Computer Science</p>
                  </div>
                </div>
              </div>
            )}

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.label}
                  variant={item.active ? "default" : "ghost"}
                  className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-3'}`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <item.icon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-2'}`} />
                  {!sidebarCollapsed && item.label}
                </Button>
              ))}
            </nav>

            {!sidebarCollapsed && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="border-t border-border pt-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start" data-testid="nav-settings">
                    <Settings className="h-5 w-5 mr-2" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" data-testid="nav-help">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Help
                  </Button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6 space-y-6">
            {/* Welcome Message */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="heading-welcome">
                Good morning, {user?.firstName || 'Sarah'}! ☀️
              </h1>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-quick-actions">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quickActions.map((action) => (
                    <QuickActionCard
                      key={action.title}
                      icon={action.icon}
                      title={action.title}
                      description={action.description}
                      color={action.color}
                      testId={`action-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nearby Services */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-nearby-services">Nearby Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {nearbyServices.map((service, index) => (
                    <Card key={service.name} className="p-4" data-testid={`service-card-${index}`}>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-foreground" data-testid={`service-name-${index}`}>
                            {service.name}
                          </h3>
                          <Badge variant="secondary" data-testid={`service-status-${index}`}>
                            {service.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground" data-testid={`service-type-${index}`}>
                          {service.type}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span data-testid={`service-rating-${index}`}>{service.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <Navigation className="h-4 w-4 text-muted-foreground mr-1" />
                            <span data-testid={`service-distance-${index}`}>{service.distance}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {service.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-recent-activity">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3" data-testid={`activity-${index}`}>
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <span className="text-foreground" data-testid={`activity-action-${index}`}>
                          {activity.action}
                        </span>
                        <span className="text-muted-foreground ml-2" data-testid={`activity-time-${index}`}>
                          ({activity.time})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}