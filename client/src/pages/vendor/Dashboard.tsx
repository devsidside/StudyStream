import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Eye, 
  Users, 
  DollarSign, 
  Star, 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp,
  Calendar,
  MessageSquare
} from "lucide-react";

export default function VendorDashboard() {
  // Mock data - in a real app, this would come from your API
  const [activeTab, setActiveTab] = useState("overview");

  const mockStats = {
    totalViews: 1234,
    totalContacts: 89,
    activeListings: 3,
    averageRating: 4.7,
    monthlyRevenue: 2500,
    conversionRate: 7.2
  };

  const mockListings = [
    {
      id: 1,
      name: "Math Tutoring Services",
      category: "tutoring",
      status: "active",
      views: 456,
      contacts: 23,
      rating: 4.8,
      createdAt: "2025-08-15"
    },
    {
      id: 2,
      name: "Computer Science Help",
      category: "tutoring", 
      status: "active",
      views: 342,
      contacts: 18,
      rating: 4.6,
      createdAt: "2025-08-20"
    },
    {
      id: 3,
      name: "Used Textbook Sales",
      category: "textbooks",
      status: "pending",
      views: 123,
      contacts: 8,
      rating: 4.5,
      createdAt: "2025-09-01"
    }
  ];

  const mockRecentActivity = [
    { type: "contact", message: "New contact from student for Math Tutoring", time: "2 hours ago" },
    { type: "view", message: "Your Computer Science Help listing was viewed 15 times", time: "6 hours ago" },
    { type: "rating", message: "New 5-star rating received for Math Tutoring", time: "1 day ago" },
    { type: "contact", message: "New contact from student for Used Textbook Sales", time: "2 days ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="heading-vendor-dashboard">
                Vendor Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your services and track your performance
              </p>
            </div>
            <Button className="gap-2" data-testid="button-add-service">
              <Plus className="h-4 w-4" />
              Add New Service
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="listings" data-testid="tab-listings">My Listings</TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
              <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card data-testid="card-total-views">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-total-views">{mockStats.totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-total-contacts">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-total-contacts">{mockStats.totalContacts}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+8%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-average-rating">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-average-rating">{mockStats.averageRating}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+0.2</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-active-listings">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-active-listings">{mockStats.activeListings}</div>
                    <p className="text-xs text-muted-foreground">
                      1 pending approval
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-conversion-rate">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-conversion-rate">{mockStats.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+1.2%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-monthly-revenue">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Est. Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-monthly-revenue">${mockStats.monthlyRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+15%</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle data-testid="heading-recent-activity">Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3" data-testid={`activity-${index}`}>
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'contact' ? 'bg-blue-500' :
                          activity.type === 'view' ? 'bg-green-500' :
                          activity.type === 'rating' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-foreground" data-testid={`activity-message-${index}`}>{activity.message}</p>
                          <p className="text-xs text-muted-foreground" data-testid={`activity-time-${index}`}>{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Listings Tab */}
            <TabsContent value="listings" className="space-y-6">
              <div className="space-y-4">
                {mockListings.map((listing) => (
                  <Card key={listing.id} data-testid={`card-listing-${listing.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg" data-testid={`text-listing-name-${listing.id}`}>{listing.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant={listing.status === 'active' ? 'default' : 'secondary'}
                              data-testid={`badge-status-${listing.id}`}
                            >
                              {listing.status}
                            </Badge>
                            <Badge variant="outline" data-testid={`badge-category-${listing.id}`}>
                              {listing.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-${listing.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-delete-${listing.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground" data-testid={`text-views-${listing.id}`}>{listing.views}</p>
                          <p className="text-sm text-muted-foreground">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground" data-testid={`text-contacts-${listing.id}`}>{listing.contacts}</p>
                          <p className="text-sm text-muted-foreground">Contacts</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground" data-testid={`text-rating-${listing.id}`}>{listing.rating}</p>
                          <p className="text-sm text-muted-foreground">Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground" data-testid={`text-created-${listing.id}`}>
                            {new Date(listing.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">Created</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle data-testid="heading-analytics">Performance Analytics</CardTitle>
                  <CardDescription>Detailed insights into your service performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground" data-testid="text-analytics-placeholder">
                      Detailed analytics charts and insights would be displayed here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle data-testid="heading-messages">Messages & Inquiries</CardTitle>
                  <CardDescription>Student inquiries and communication</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground" data-testid="text-messages-placeholder">
                      Student messages and inquiries would be displayed here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}