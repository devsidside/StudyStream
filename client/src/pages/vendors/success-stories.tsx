import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Quote, TrendingUp, Users, DollarSign, Award } from "lucide-react";

export default function SuccessStories() {
  const stories = [
    {
      id: 1,
      vendor: "TutorPro Academic Services",
      owner: "Sarah Johnson",
      category: "Tutoring",
      image: "/api/placeholder/200/200",
      rating: 4.9,
      reviews: 127,
      quote: "StudyConnect transformed my small tutoring business into a thriving educational service. I went from 5 students to over 100 in just 6 months!",
      metrics: {
        monthlyRevenue: 8500,
        studentsHelped: 150,
        growthRate: 320
      },
      joinedDate: "January 2024",
      highlights: [
        "320% increase in monthly revenue",
        "Expanded from math to multiple subjects",
        "Built a team of 5 professional tutors",
        "Achieved 98% student satisfaction rate"
      ]
    },
    {
      id: 2,
      vendor: "Campus Textbook Exchange",
      owner: "Mike Chen",
      category: "Textbooks",
      image: "/api/placeholder/200/200",
      rating: 4.7,
      reviews: 89,
      quote: "The platform made it so easy to connect with students looking for affordable textbooks. My sustainable textbook business is now helping hundreds of students save money.",
      metrics: {
        monthlyRevenue: 3200,
        studentsHelped: 200,
        growthRate: 180
      },
      joinedDate: "March 2024",
      highlights: [
        "Helped students save over $50,000 on textbooks",
        "Built a sustainable circular economy model",
        "Expanded to 3 university campuses",
        "Featured in local sustainability awards"
      ]
    },
    {
      id: 3,
      vendor: "QuickBites Campus Delivery",
      owner: "Elena Rodriguez",
      category: "Food & Catering",
      image: "/api/placeholder/200/200",
      rating: 4.8,
      reviews: 203,
      quote: "Starting with just home-cooked meals for my dorm, I now run a full catering service for campus events. StudyConnect gave me the platform to reach every student on campus.",
      metrics: {
        monthlyRevenue: 12000,
        studentsHelped: 500,
        growthRate: 450
      },
      joinedDate: "September 2023",
      highlights: [
        "Grew from dorm room to commercial kitchen",
        "Catering for 20+ campus events monthly",
        "Hired 8 part-time student employees",
        "Partnership with campus dining services"
      ]
    }
  ];

  const stats = [
    {
      icon: DollarSign,
      label: "Average Monthly Revenue",
      value: "$5,200",
      description: "Vendors see significant revenue growth within 6 months"
    },
    {
      icon: Users,
      label: "Students Reached",
      value: "10,000+",
      description: "Active student users looking for vendor services"
    },
    {
      icon: TrendingUp,
      label: "Average Growth Rate",
      value: "250%",
      description: "Year-over-year revenue growth for active vendors"
    },
    {
      icon: Award,
      label: "Success Rate",
      value: "92%",
      description: "Of vendors report positive ROI within 3 months"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="heading-success-stories">
              Success Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how vendors are building thriving businesses and making a difference in students' lives through our platform
            </p>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="text-center" data-testid={`card-stat-${index}`}>
                <CardHeader>
                  <stat.icon className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle className="text-3xl font-bold text-primary" data-testid={`text-stat-value-${index}`}>
                    {stat.value}
                  </CardTitle>
                  <CardDescription className="font-medium" data-testid={`text-stat-label-${index}`}>
                    {stat.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground" data-testid={`text-stat-description-${index}`}>
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Success Stories */}
          <div className="space-y-12">
            {stories.map((story, index) => (
              <Card key={story.id} className="overflow-hidden" data-testid={`card-story-${story.id}`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Story Content */}
                  <div className="lg:col-span-2 p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2" data-testid={`text-vendor-name-${story.id}`}>
                          {story.vendor}
                        </h3>
                        <p className="text-muted-foreground" data-testid={`text-owner-name-${story.id}`}>
                          Founded by {story.owner}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline" data-testid={`badge-category-${story.id}`}>
                            {story.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium" data-testid={`text-rating-${story.id}`}>
                              {story.rating}
                            </span>
                            <span className="text-muted-foreground" data-testid={`text-reviews-${story.id}`}>
                              ({story.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <Quote className="h-8 w-8 text-primary opacity-50" />
                    </div>

                    <blockquote className="text-lg text-foreground mb-6 italic" data-testid={`text-quote-${story.id}`}>
                      "{story.quote}"
                    </blockquote>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary" data-testid={`text-revenue-${story.id}`}>
                          ${story.metrics.monthlyRevenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary" data-testid={`text-students-${story.id}`}>
                          {story.metrics.studentsHelped}+
                        </p>
                        <p className="text-sm text-muted-foreground">Students Helped</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary" data-testid={`text-growth-${story.id}`}>
                          +{story.metrics.growthRate}%
                        </p>
                        <p className="text-sm text-muted-foreground">Growth Rate</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {story.highlights.map((highlight, highlightIndex) => (
                          <li key={highlightIndex} className="flex items-start gap-2" data-testid={`highlight-${story.id}-${highlightIndex}`}>
                            <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Vendor Profile Card */}
                  <div className="bg-muted/30 p-8 flex flex-col justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-foreground">
                          {story.owner.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2" data-testid={`text-profile-owner-${story.id}`}>
                        {story.owner}
                      </h4>
                      <p className="text-muted-foreground mb-4" data-testid={`text-joined-date-${story.id}`}>
                        Joined {story.joinedDate}
                      </p>
                      <Button className="w-full" data-testid={`button-contact-${story.id}`}>
                        Contact {story.owner.split(' ')[0]}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 p-12 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="heading-cta">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of successful vendors who are building thriving businesses and making a difference in students' lives
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2" data-testid="button-get-started">
                <TrendingUp className="h-5 w-5" />
                Get Started Today
              </Button>
              <Button variant="outline" size="lg" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>
          </div>

          {/* Testimonial Grid */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-foreground mb-8" data-testid="heading-testimonials">
              What Our Vendors Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  quote: "The best decision I made for my tutoring business. The platform is intuitive and the support is excellent.",
                  author: "Alex Thompson",
                  business: "Math Mastery Tutoring"
                },
                {
                  quote: "I love how easy it is to connect with students. The analytics help me understand what services are most in demand.",
                  author: "Jennifer Lee",
                  business: "Campus Study Solutions"
                },
                {
                  quote: "From zero to hero in 6 months. This platform gave my small service the visibility it needed to grow.",
                  author: "David Wilson",
                  business: "Tech Repair Campus"
                }
              ].map((testimonial, index) => (
                <Card key={index} data-testid={`card-testimonial-${index}`}>
                  <CardContent className="p-6">
                    <Quote className="h-6 w-6 text-primary mb-4" />
                    <p className="text-muted-foreground mb-4 italic" data-testid={`text-testimonial-quote-${index}`}>
                      "{testimonial.quote}"
                    </p>
                    <div className="border-t pt-4">
                      <p className="font-medium text-foreground" data-testid={`text-testimonial-author-${index}`}>
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-business-${index}`}>
                        {testimonial.business}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}