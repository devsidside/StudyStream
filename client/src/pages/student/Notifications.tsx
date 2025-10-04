import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      title: "New notes uploaded",
      message: "Computer Science - Data Structures notes are now available",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Study group invitation",
      message: "You've been invited to join Mathematics Study Group",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      title: "Rating received",
      message: "Your notes received a 5-star rating!",
      time: "2 days ago",
      read: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3" data-testid="text-notifications-title">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          <Button variant="outline" data-testid="button-mark-all-read">
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={notification.read ? "opacity-60" : "border-primary"}
              data-testid={`card-notification-${notification.id}`}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{notification.title}</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    {notification.time}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground" data-testid={`text-notification-message-${notification.id}`}>
                  {notification.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
