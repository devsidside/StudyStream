import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  GraduationCap, 
  Heart, 
  DollarSign, 
  Users, 
  MapPin, 
  Clock, 
  Phone,
  Mail,
  ExternalLink
} from "lucide-react";

export default function CampusResources() {
  const resourceCategories = [
    {
      title: "Academic Support",
      icon: GraduationCap,
      description: "Get help with your studies and academic success",
      resources: [
        {
          name: "Writing Center",
          description: "Free tutoring for essays, research papers, and academic writing",
          location: "Library Building, 2nd Floor",
          hours: "Mon-Fri 9AM-5PM",
          contact: "writing@university.edu",
          phone: "(555) 123-4567"
        },
        {
          name: "Math Help Center",
          description: "Drop-in tutoring for all math courses from basic algebra to calculus",
          location: "Math Building, Room 101",
          hours: "Mon-Thu 10AM-8PM, Fri 10AM-4PM",
          contact: "mathhelp@university.edu",
          phone: "(555) 123-4568"
        },
        {
          name: "Student Success Coaching",
          description: "One-on-one academic coaching for study skills and time management",
          location: "Student Services Building",
          hours: "By appointment",
          contact: "success@university.edu",
          phone: "(555) 123-4569"
        }
      ]
    },
    {
      title: "Health & Wellness",
      icon: Heart,
      description: "Mental and physical health resources for students",
      resources: [
        {
          name: "Counseling Center",
          description: "Free confidential counseling and mental health services",
          location: "Health Services Building",
          hours: "Mon-Fri 8AM-5PM, Emergency 24/7",
          contact: "counseling@university.edu",
          phone: "(555) 123-4570"
        },
        {
          name: "Campus Recreation Center",
          description: "Fitness facilities, group classes, and recreational sports",
          location: "Recreation Complex",
          hours: "Mon-Sun 5AM-11PM",
          contact: "recreation@university.edu",
          phone: "(555) 123-4571"
        },
        {
          name: "Health Clinic",
          description: "Basic medical care and health services for students",
          location: "Health Services Building",
          hours: "Mon-Fri 8AM-5PM",
          contact: "health@university.edu",
          phone: "(555) 123-4572"
        }
      ]
    },
    {
      title: "Financial Aid",
      icon: DollarSign,
      description: "Financial assistance and scholarship opportunities",
      resources: [
        {
          name: "Financial Aid Office",
          description: "Help with FAFSA, scholarships, grants, and student loans",
          location: "Student Services Building, 1st Floor",
          hours: "Mon-Fri 8AM-5PM",
          contact: "finaid@university.edu",
          phone: "(555) 123-4573"
        },
        {
          name: "Emergency Financial Assistance",
          description: "Short-term financial help for unexpected expenses",
          location: "Student Services Building",
          hours: "Mon-Fri 9AM-4PM",
          contact: "emergency@university.edu",
          phone: "(555) 123-4574"
        },
        {
          name: "Student Employment",
          description: "Work-study and campus job opportunities",
          location: "Career Services Center",
          hours: "Mon-Fri 8AM-5PM",
          contact: "employment@university.edu",
          phone: "(555) 123-4575"
        }
      ]
    },
    {
      title: "Student Life",
      icon: Users,
      description: "Get involved in campus activities and organizations",
      resources: [
        {
          name: "Student Activities Center",
          description: "Information about clubs, organizations, and campus events",
          location: "Student Union Building",
          hours: "Mon-Fri 8AM-5PM",
          contact: "activities@university.edu",
          phone: "(555) 123-4576"
        },
        {
          name: "Greek Life",
          description: "Fraternity and sorority information and recruitment",
          location: "Greek Life Office, Student Union",
          hours: "Mon-Fri 9AM-5PM",
          contact: "greek@university.edu",
          phone: "(555) 123-4577"
        },
        {
          name: "International Student Services",
          description: "Support for international students and study abroad programs",
          location: "International Center",
          hours: "Mon-Fri 8AM-5PM",
          contact: "international@university.edu",
          phone: "(555) 123-4578"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="heading-campus-resources">
              Campus Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover all the support services and resources available to help you succeed at university
            </p>
          </div>

          {/* Resources by Category */}
          <div className="space-y-8">
            {resourceCategories.map((category, categoryIndex) => (
              <div key={category.title}>
                <div className="flex items-center gap-3 mb-6">
                  <category.icon className="h-8 w-8 text-primary" />
                  <div>
                    <h2 className="text-2xl font-bold text-foreground" data-testid={`heading-${category.title.toLowerCase().replace(/ /g, '-')}`}>
                      {category.title}
                    </h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.resources.map((resource, resourceIndex) => (
                    <Card key={resource.name} className="hover:shadow-lg transition-shadow" data-testid={`card-resource-${categoryIndex}-${resourceIndex}`}>
                      <CardHeader>
                        <CardTitle className="text-lg" data-testid={`text-resource-name-${categoryIndex}-${resourceIndex}`}>
                          {resource.name}
                        </CardTitle>
                        <CardDescription data-testid={`text-resource-description-${categoryIndex}-${resourceIndex}`}>
                          {resource.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground" data-testid={`text-resource-location-${categoryIndex}-${resourceIndex}`}>
                              {resource.location}
                            </span>
                          </div>
                          
                          <div className="flex items-start gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground" data-testid={`text-resource-hours-${categoryIndex}-${resourceIndex}`}>
                              {resource.hours}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <a 
                              href={`mailto:${resource.contact}`} 
                              className="text-primary hover:underline"
                              data-testid={`link-resource-email-${categoryIndex}-${resourceIndex}`}
                            >
                              {resource.contact}
                            </a>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <a 
                              href={`tel:${resource.phone}`} 
                              className="text-primary hover:underline"
                              data-testid={`link-resource-phone-${categoryIndex}-${resourceIndex}`}
                            >
                              {resource.phone}
                            </a>
                          </div>

                          <Button className="w-full mt-4 gap-2" variant="outline" data-testid={`button-visit-${categoryIndex}-${resourceIndex}`}>
                            Visit Website
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Contacts */}
          <div className="mt-12 p-6 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-bold text-foreground mb-4" data-testid="heading-emergency">
              Emergency Contacts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-medium text-foreground">Campus Security</p>
                <p className="text-lg font-bold text-primary" data-testid="text-security-phone">(555) 911-HELP</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Crisis Hotline</p>
                <p className="text-lg font-bold text-primary" data-testid="text-crisis-phone">(555) 273-8255</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Emergency Services</p>
                <p className="text-lg font-bold text-primary" data-testid="text-emergency-phone">911</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}