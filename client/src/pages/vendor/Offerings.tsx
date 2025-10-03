import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertVendorSchema } from "@shared/schema";
import { z } from "zod";
import { Store, Users, DollarSign, CheckCircle } from "lucide-react";

const formSchema = insertVendorSchema.extend({
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function ListService() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      location: "",
      priceRange: "",
      isActive: true,
    },
  });

  const createVendorMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("/api/vendors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast({
        title: "Service Listed Successfully!",
        description: "Your service has been submitted for review and will be live shortly.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to list your service. Please try again.",
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createVendorMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Users,
      title: "Reach Students",
      description: "Connect with thousands of students looking for your services"
    },
    {
      icon: DollarSign,
      title: "Grow Your Business",
      description: "Increase revenue by tapping into the student market"
    },
    {
      icon: CheckCircle,
      title: "Easy Management",
      description: "Simple dashboard to manage listings and track performance"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="heading-list-service">
              List Your Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with students and grow your business by listing your services on our platform
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <Card key={benefit.title} className="text-center" data-testid={`card-benefit-${index}`}>
                <CardHeader>
                  <benefit.icon className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg" data-testid={`text-benefit-title-${index}`}>
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription data-testid={`text-benefit-description-${index}`}>
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Service Listing Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2" data-testid="heading-service-form">
                <Store className="h-6 w-6" />
                Service Information
              </CardTitle>
              <CardDescription>
                Fill out the form below to list your service. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Academic Tutoring Services" {...field} data-testid="input-service-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tutoring">Tutoring</SelectItem>
                              <SelectItem value="textbooks">Textbooks</SelectItem>
                              <SelectItem value="housing">Housing</SelectItem>
                              <SelectItem value="food">Food & Catering</SelectItem>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="transportation">Transportation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your service, what makes it unique, and how it helps students..."
                            className="min-h-[100px]"
                            {...field}
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of your service (minimum 10 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@yourservice.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourwebsite.com" {...field} data-testid="input-website" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Range</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., $20-50/hour or $100-200" {...field} data-testid="input-price-range" />
                          </FormControl>
                          <FormDescription>
                            Optional: Help students understand your pricing
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Near Campus, Downtown, Online" {...field} data-testid="input-location" />
                        </FormControl>
                        <FormDescription>
                          Where do you provide your service?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    data-testid="button-submit-service"
                  >
                    {isSubmitting ? "Submitting..." : "List My Service"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 p-6 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="heading-what-next">
              What happens next?
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Your service will be reviewed by our team within 24-48 hours</li>
              <li>• Once approved, it will be visible to students on our platform</li>
              <li>• You'll receive an email confirmation when your listing goes live</li>
              <li>• Students can contact you directly through the information provided</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}