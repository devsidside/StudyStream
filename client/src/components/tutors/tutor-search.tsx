import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Search, GraduationCap, BookOpen, Users, Star, Clock, MapPin, DollarSign, Calendar } from "lucide-react";
import type { TutorSearchFilters } from "@shared/schema";

// Form validation schema
const searchSchema = z.object({
  subject: z.string().optional(),
  query: z.string().optional(),
  mode: z.enum(['online', 'in_person', 'both']).optional(),
  priceRange: z.enum(['0-500', '500-1000', '1000-2000', '2000+']).optional(),
});

// Popular search suggestions
const POPULAR_SEARCHES = [
  { text: "Physics JEE", subject: "Physics", examType: "JEE", icon: "⚡" },
  { text: "Math NEET", subject: "Mathematics", examType: "NEET", icon: "📊" },
  { text: "JavaScript Programming", subject: "Programming", category: "Technology", icon: "💻" },
  { text: "English Writing", subject: "English", category: "Languages", icon: "✍️" },
  { text: "Data Structures", subject: "Computer Science", category: "Technology", icon: "🔗" },
  { text: "SAT Prep", examType: "SAT", icon: "🎯" },
  { text: "Spanish Conversation", subject: "Spanish", category: "Languages", icon: "🗣️" },
  { text: "Chemistry Organic", subject: "Chemistry", category: "Science", icon: "🧪" },
];

// Trending subjects
const TRENDING_SUBJECTS = [
  { name: "AI & Machine Learning", category: "Technology", tutors: 245, trend: "+15%", icon: "🤖" },
  { name: "JEE Physics", category: "Exam Prep", tutors: 189, trend: "+8%", icon: "⚡" },
  { name: "IELTS English", category: "Languages", tutors: 156, trend: "+12%", icon: "🌍" },
  { name: "Data Science", category: "Technology", tutors: 134, trend: "+22%", icon: "📈" },
  { name: "Calculus", category: "Mathematics", tutors: 128, trend: "+5%", icon: "∫" },
  { name: "Guitar", category: "Music", tutors: 98, trend: "+18%", icon: "🎸" },
];

// Quick filter options
const QUICK_FILTERS = [
  { key: "verified", label: "Verified Tutors", icon: "✅" },
  { key: "top_rated", label: "Top Rated (4.5+)", icon: "⭐" },
  { key: "online", label: "Online Sessions", icon: "💻" },
  { key: "instant_book", label: "Instant Booking", icon: "⚡" },
  { key: "free_trial", label: "Free Trial", icon: "🆓" },
  { key: "money_back", label: "Money Back Guarantee", icon: "💰" },
];

interface TutorSearchProps {
  onSearch: (filters: TutorSearchFilters) => void;
  onFiltersChange: (filters: TutorSearchFilters) => void;
}

export default function TutorSearch({ onSearch, onFiltersChange }: TutorSearchProps) {
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      subject: "",
      query: "",
      mode: undefined,
      priceRange: undefined,
    },
  });

  const handleSubmit = (data: z.infer<typeof searchSchema>) => {
    const filters: TutorSearchFilters = {
      ...data,
      quickFilters: activeQuickFilters,
    };
    onSearch(filters);
  };

  const handlePopularSearchClick = (search: typeof POPULAR_SEARCHES[0]) => {
    const filters: TutorSearchFilters = {
      subject: search.subject,
      examType: search.examType,
      category: search.category,
    };
    onSearch(filters);
  };

  const handleTrendingClick = (subject: typeof TRENDING_SUBJECTS[0]) => {
    const filters: TutorSearchFilters = {
      subject: subject.name,
      category: subject.category,
    };
    onSearch(filters);
  };

  const toggleQuickFilter = (filterKey: string) => {
    setActiveQuickFilters(prev => 
      prev.includes(filterKey)
        ? prev.filter(k => k !== filterKey)
        : [...prev, filterKey]
    );
  };

  return (
    <div className="space-y-8" data-testid="tutor-search">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-blue-600 text-sm font-medium">
            <GraduationCap className="w-5 h-5" />
            <span>BOOK TUTORS & COACHING</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Find Your Perfect Tutor
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with expert tutors for personalized learning. From exam prep to skill development, 
            find verified tutors who match your learning style and schedule.
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Main Search Bar */}
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                              {...field}
                              placeholder="Search for subjects, topics, or exam prep (e.g., Physics JEE, JavaScript, IELTS)"
                              className="pl-10 h-12 text-lg"
                              data-testid="input-search-query"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Search Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange} data-testid="select-subject">
                            <SelectTrigger>
                              <SelectValue placeholder="Subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mathematics">Mathematics</SelectItem>
                              <SelectItem value="Physics">Physics</SelectItem>
                              <SelectItem value="Chemistry">Chemistry</SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Computer Science">Computer Science</SelectItem>
                              <SelectItem value="Programming">Programming</SelectItem>
                              <SelectItem value="Spanish">Spanish</SelectItem>
                              <SelectItem value="French">French</SelectItem>
                              <SelectItem value="Guitar">Guitar</SelectItem>
                              <SelectItem value="Piano">Piano</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange} data-testid="select-mode">
                            <SelectTrigger>
                              <SelectValue placeholder="Mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">🌐 Online</SelectItem>
                              <SelectItem value="in_person">📍 In-Person</SelectItem>
                              <SelectItem value="both">🔄 Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priceRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange} data-testid="select-price-range">
                            <SelectTrigger>
                              <SelectValue placeholder="Price Range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-500">₹0 - ₹500/hr</SelectItem>
                              <SelectItem value="500-1000">₹500 - ₹1000/hr</SelectItem>
                              <SelectItem value="1000-2000">₹1000 - ₹2000/hr</SelectItem>
                              <SelectItem value="2000+">₹2000+/hr</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="h-11" data-testid="button-search">
                    <Search className="w-4 h-4 mr-2" />
                    Find Tutors
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Quick Filters */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {QUICK_FILTERS.map((filter) => (
            <Badge
              key={filter.key}
              variant={activeQuickFilters.includes(filter.key) ? "default" : "outline"}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => toggleQuickFilter(filter.key)}
              data-testid={`filter-${filter.key}`}
            >
              <span className="mr-1">{filter.icon}</span>
              {filter.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Popular Searches */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">🔥 Popular Searches</h2>
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {POPULAR_SEARCHES.map((search, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handlePopularSearchClick(search)}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
              data-testid={`popular-search-${index}`}
            >
              <span className="mr-1">{search.icon}</span>
              {search.text}
            </Button>
          ))}
        </div>
      </div>

      {/* Trending Subjects */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">📈 Trending Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {TRENDING_SUBJECTS.map((subject, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTrendingClick(subject)}
              data-testid={`trending-subject-${index}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{subject.icon}</span>
                      <div>
                        <h3 className="font-semibold">{subject.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{subject.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{subject.tutors} tutors</p>
                    <p className="text-xs text-green-600">{subject.trend}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Success Guarantee Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-blue-600 text-lg font-semibold">
              <Star className="w-6 h-6 fill-current" />
              <span>SUCCESS GUARANTEE</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Learning Success is Our Priority
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="text-3xl">🎯</div>
                <h4 className="font-semibold">Personalized Matching</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered tutor matching based on your learning style and goals
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">💰</div>
                <h4 className="font-semibold">Money-Back Promise</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Not satisfied with your first session? Get a full refund
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">⚡</div>
                <h4 className="font-semibold">Quick Booking</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Book sessions instantly or schedule up to 2 weeks ahead
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">🛡️</div>
                <h4 className="font-semibold">Verified Quality</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All tutors are background-checked and reviewed by students
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}