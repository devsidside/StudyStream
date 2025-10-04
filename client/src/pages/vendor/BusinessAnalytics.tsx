import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function BusinessAnalytics() {
  const stats = [
    {
      title: "Total Views",
      value: "2,547",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Bookings",
      value: "124",
      change: "+8.2%",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Revenue",
      value: "$4,329",
      change: "+15.3%",
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      title: "Conversion Rate",
      value: "4.87%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-8" data-testid="text-analytics-title">
          Business Analytics
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} data-testid={`card-stat-${index}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid={`text-stat-value-${index}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1" data-testid={`text-stat-change-${index}`}>
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analytics charts and detailed performance metrics will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
