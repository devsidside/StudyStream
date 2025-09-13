import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  BookOpen, 
  Home, 
  GraduationCap, 
  Star, 
  Download, 
  Save, 
  Eye, 
  Share, 
  Phone, 
  Calendar, 
  MessageCircle,
  Rocket,
  Key,
  CheckCircle,
  Users,
  Clock
} from "lucide-react";
import { Link } from "wouter";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-24 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">🎯 HOW IT WORKS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              A simple, three-step process to get you started fast
            </h1>
          </div>
        </div>
      </section>

      {/* Three Steps Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors" data-testid="step-1-card">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="secondary" className="absolute top-4 right-4">STEP 1</Badge>
                <CardTitle className="text-xl">🔍 Search & Discover</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Enter what you need (notes, hostels, tutors)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Filter by category & location</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>AI-powered suggestions</span>
                  </li>
                </ul>
                <div className="pt-4 space-y-2">
                  <Button className="w-full" data-testid="button-try-now">
                    <Search className="w-4 h-4 mr-2" />
                    Try Now
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-view-demo">
                    <Eye className="w-4 h-4 mr-2" />
                    View Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors" data-testid="step-2-card">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge variant="secondary" className="absolute top-4 right-4">STEP 2</Badge>
                <CardTitle className="text-xl">📋 Compare & Evaluate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Read verified reviews and compare options</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>View ratings, photos, pricing, availability</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Save favorites for later</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button className="w-full" data-testid="button-save-compare">
                    <Save className="w-4 h-4 mr-2" />
                    Save & Compare
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors" data-testid="step-3-card">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <Badge variant="secondary" className="absolute top-4 right-4">STEP 3</Badge>
                <CardTitle className="text-xl">📅 Book & Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Book with one click</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Receive instant confirmation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Chat directly with providers</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Rate your experience</span>
                  </li>
                </ul>
                <div className="pt-4 space-y-2">
                  <Button className="w-full" data-testid="button-book-service">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Service
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-chat-provider">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Area Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-2">
            <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <CardTitle className="text-2xl">DEMO AREA</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Search & Map */}
                <div className="space-y-6">
                  {/* Search Box */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Search Box</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Data structures notes near me"
                          className="pl-10"
                          data-testid="demo-search-input"
                        />
                      </div>
                      <Select>
                        <SelectTrigger data-testid="demo-location-select">
                          <SelectValue placeholder="📍 Location: Bangalore" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bangalore">📍 Bangalore</SelectItem>
                          <SelectItem value="mumbai">📍 Mumbai</SelectItem>
                          <SelectItem value="delhi">📍 Delhi</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="w-full" data-testid="demo-search-button">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Map Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Map Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <MapPin className="w-8 h-8 text-primary absolute top-4 left-4" />
                        <MapPin className="w-6 h-6 text-blue-600 absolute top-8 right-8" />
                        <MapPin className="w-7 h-7 text-purple-600 absolute bottom-6 left-8" />
                        <div className="text-center space-y-2">
                          <p className="text-sm font-medium">Interactive Map</p>
                          <p className="text-xs text-muted-foreground">City markers show service density</p>
                          <p className="text-xs text-muted-foreground">Zoom & filter layers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Side - Comparison Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Comparison Panel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Notes Result */}
                    <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors" data-testid="demo-notes-result">
                      <div className="flex items-start space-x-3">
                        <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold">📚 Data Structures Notes</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="ml-1">4.9</span>
                            </div>
                            <span>•</span>
                            <span className="text-green-600 font-medium">Free</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Download className="w-4 h-4" />
                            <span>1.8k downloads</span>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" variant="outline" data-testid="demo-save-notes">
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" data-testid="demo-view-notes">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" data-testid="demo-share-notes">
                              <Share className="w-3 h-3 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hostel Result */}
                    <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors" data-testid="demo-hostel-result">
                      <div className="flex items-start space-x-3">
                        <Home className="w-6 h-6 text-green-600 mt-1" />
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold">🏠 Green Valley Hostel</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              {[1,2,3,4].map((star) => (
                                <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                              <Star className="w-3 h-3 text-gray-300" />
                              <span className="ml-1">4.2</span>
                            </div>
                            <span>•</span>
                            <span className="font-medium">₹8k/month</span>
                          </div>
                          <p className="text-sm text-muted-foreground">0.5mi from campus</p>
                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" variant="outline" data-testid="demo-call-hostel">
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline" data-testid="demo-book-visit">
                              <Calendar className="w-3 h-3 mr-1" />
                              Book Visit
                            </Button>
                            <Button size="sm" variant="outline" data-testid="demo-chat-hostel">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Chat
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tutor Result */}
                    <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors" data-testid="demo-tutor-result">
                      <div className="flex items-start space-x-3">
                        <GraduationCap className="w-6 h-6 text-purple-600 mt-1" />
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold">👨‍🏫 Prof. Sharma - Math Tutor</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="ml-1">5.0</span>
                            </div>
                            <span>•</span>
                            <span className="font-medium">₹500/hr</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Online & In-person</p>
                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" variant="outline" data-testid="demo-book-session">
                              <Calendar className="w-3 h-3 mr-1" />
                              Book Session
                            </Button>
                            <Button size="sm" variant="outline" data-testid="demo-message-tutor">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Demo Tip */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-center text-blue-700 dark:text-blue-300">
                  💡 Use the interactive demo above to experience how easy it is to find, compare, and book the services you need—all in under 60 seconds.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why It Works Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">WHY IT WORKS</h2>
              <p className="text-xl text-muted-foreground mt-4 max-w-4xl mx-auto">
                StudyConnect simplifies your student life by offering a unified platform for academic resources, accommodations, tutoring, and community—all in three steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Simple Search */}
              <Card className="border-2 hover:border-primary/20 transition-colors" data-testid="benefit-search-card">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">🔍 Simple Search</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Find any service/resource</li>
                    <li>Filter by your needs</li>
                    <li>AI suggestions guide you</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Smart Comparison */}
              <Card className="border-2 hover:border-primary/20 transition-colors" data-testid="benefit-comparison-card">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">📋 Smart Comparison</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>See ratings, reviews, pricing, features</li>
                    <li>Save & shortlist favorites</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Instant Booking */}
              <Card className="border-2 hover:border-primary/20 transition-colors" data-testid="benefit-booking-card">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">📅 Instant Booking</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Real-time availability</li>
                    <li>Confirm instantly</li>
                    <li>Direct chat with provider</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-purple-50 to-primary/10 dark:from-primary/20 dark:via-purple-950 dark:to-primary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to start?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button size="lg" className="px-8" data-testid="button-explore-platform">
                  <Rocket className="w-5 h-5 mr-2" />
                  🚀 Explore Platform
                </Button>
              </Link>
              <Link href="/api/login">
                <Button variant="outline" size="lg" className="px-8" data-testid="button-sign-up-free">
                  <Key className="w-5 h-5 mr-2" />
                  🔑 Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}