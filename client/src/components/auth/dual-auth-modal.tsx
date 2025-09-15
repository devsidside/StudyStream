import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, GraduationCap, Building2, Mail, Lock, User, MapPin, BookOpen, Calendar, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

// Student login schema
const studentLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Vendor login schema  
const vendorLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Student signup schema
const studentSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  university: z.string().min(1, "University is required"),
  course: z.string().min(1, "Course is required"),
  year: z.string().min(1, "Year is required"),
});

// Vendor signup schema
const vendorSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  businessType: z.string().min(1, "Business type is required"),
  businessName: z.string().min(1, "Business name is required"),
});

type StudentLoginData = z.infer<typeof studentLoginSchema>;
type VendorLoginData = z.infer<typeof vendorLoginSchema>;
type StudentSignupData = z.infer<typeof studentSignupSchema>;
type VendorSignupData = z.infer<typeof vendorSignupSchema>;

interface DualAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'login' | 'signup';
}

export default function DualAuthModal({ open, onOpenChange, type }: DualAuthModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'student' | 'vendor'>('student');
  const { signIn, signUp, signInWithOAuth } = useAuth();

  // Student login form
  const studentLoginForm = useForm<StudentLoginData>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Vendor login form
  const vendorLoginForm = useForm<VendorLoginData>({
    resolver: zodResolver(vendorLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Student signup form
  const studentSignupForm = useForm<StudentSignupData>({
    resolver: zodResolver(studentSignupSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      university: "",
      course: "",
      year: "",
    },
  });

  // Vendor signup form
  const vendorSignupForm = useForm<VendorSignupData>({
    resolver: zodResolver(vendorSignupSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      businessType: "",
      businessName: "",
    },
  });

  const handleStudentLogin = async (data: StudentLoginData) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        setAuthError(error.message || "Failed to sign in. Please check your credentials.");
        return;
      }
      
      onOpenChange(false);
      studentLoginForm.reset();
    } catch (error) {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVendorLogin = async (data: VendorLoginData) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        setAuthError(error.message || "Failed to sign in. Please check your credentials.");
        return;
      }
      
      onOpenChange(false);
      vendorLoginForm.reset();
    } catch (error) {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentSignup = async (data: StudentSignupData) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const { error } = await signUp(data.email, data.password, {
        role: 'student',
        firstName: data.firstName,
        lastName: data.lastName,
        university: data.university,
        course: data.course,
        year: data.year,
      });
      
      if (error) {
        setAuthError(error.message || "Failed to create account. Please try again.");
        return;
      }
      
      onOpenChange(false);
      studentSignupForm.reset();
    } catch (error) {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVendorSignup = async (data: VendorSignupData) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const { error } = await signUp(data.email, data.password, {
        role: 'vendor',
        firstName: data.firstName,
        lastName: data.lastName,
        businessType: data.businessType,
        businessName: data.businessName,
      });
      
      if (error) {
        setAuthError(error.message || "Failed to create account. Please try again.");
        return;
      }
      
      onOpenChange(false);
      vendorSignupForm.reset();
    } catch (error) {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setAuthError(null);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        setAuthError(error.message || `Failed to sign in with ${provider}`);
      }
    } catch (error) {
      setAuthError(`An error occurred signing in with ${provider}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            {type === 'login' ? 'Welcome Back!' : 'Join StudyConnect'}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            {type === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Create your account and start connecting'}
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'student' | 'vendor')} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student" className="flex items-center gap-2" data-testid="tab-student">
              <GraduationCap className="h-4 w-4" />
              {type === 'login' ? 'Login as Student' : 'Sign Up (Student)'}
            </TabsTrigger>
            <TabsTrigger value="vendor" className="flex items-center gap-2" data-testid="tab-vendor">
              <Building2 className="h-4 w-4" />
              {type === 'login' ? 'Login as Vendor' : 'List Your Service'}
            </TabsTrigger>
          </TabsList>

          {/* Student Tab */}
          <TabsContent value="student" className="space-y-4 mt-6">
            {type === 'login' ? (
              <Form {...studentLoginForm}>
                <form onSubmit={studentLoginForm.handleSubmit(handleStudentLogin)} className="space-y-4">
                  <FormField
                    control={studentLoginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email / University ID</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Enter your email or university ID" 
                              className="pl-10" 
                              data-testid="input-student-email"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={studentLoginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="Enter your password" 
                              className="pl-10" 
                              data-testid="input-student-password"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {authError && (
                    <div className="text-sm text-red-500" data-testid="error-message">{authError}</div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    data-testid="button-student-login"
                  >
                    {isSubmitting ? "Signing in..." : "Login as Student"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...studentSignupForm}>
                <form onSubmit={studentSignupForm.handleSubmit(handleStudentSignup)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={studentSignupForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="First name" 
                                className="pl-10" 
                                data-testid="input-student-first-name"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentSignupForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Last name" 
                              data-testid="input-student-last-name"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={studentSignupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="your.email@university.edu" 
                              className="pl-10" 
                              data-testid="input-student-signup-email"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={studentSignupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="Create a password" 
                              className="pl-10" 
                              data-testid="input-student-signup-password"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={studentSignupForm.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="University of Mumbai" 
                              className="pl-10" 
                              data-testid="input-student-university"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={studentSignupForm.control}
                      name="course"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="Computer Science" 
                                className="pl-10" 
                                data-testid="input-student-course"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={studentSignupForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-student-year">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1st">1st Year</SelectItem>
                              <SelectItem value="2nd">2nd Year</SelectItem>
                              <SelectItem value="3rd">3rd Year</SelectItem>
                              <SelectItem value="4th">4th Year</SelectItem>
                              <SelectItem value="masters">Masters</SelectItem>
                              <SelectItem value="phd">PhD</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {authError && (
                    <div className="text-sm text-red-500" data-testid="error-message">{authError}</div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    data-testid="button-student-signup"
                  >
                    {isSubmitting ? "Creating account..." : "Sign Up Free (Student)"}
                  </Button>
                </form>
              </Form>
            )}

            {/* Social login options */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleSocialLogin('google')}
                  data-testid="button-student-google"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-4 h-4 mr-2"
                  />
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSocialLogin('facebook')}
                  data-testid="button-student-facebook"
                >
                  <img
                    src="https://www.svgrepo.com/show/448224/facebook.svg"
                    alt="Facebook"
                    className="w-4 h-4 mr-2"
                  />
                  Facebook
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Vendor Tab */}
          <TabsContent value="vendor" className="space-y-4 mt-6">
            {type === 'login' ? (
              <Form {...vendorLoginForm}>
                <form onSubmit={vendorLoginForm.handleSubmit(handleVendorLogin)} className="space-y-4">
                  <FormField
                    control={vendorLoginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Enter your business email" 
                              className="pl-10" 
                              data-testid="input-vendor-email"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={vendorLoginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="Enter your password" 
                              className="pl-10" 
                              data-testid="input-vendor-password"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {authError && (
                    <div className="text-sm text-red-500" data-testid="error-message">{authError}</div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    data-testid="button-vendor-login"
                  >
                    {isSubmitting ? "Signing in..." : "Login as Vendor"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...vendorSignupForm}>
                <form onSubmit={vendorSignupForm.handleSubmit(handleVendorSignup)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={vendorSignupForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="First name" 
                                className="pl-10" 
                                data-testid="input-vendor-first-name"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={vendorSignupForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Last name" 
                              data-testid="input-vendor-last-name"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={vendorSignupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="business@example.com" 
                              className="pl-10" 
                              data-testid="input-vendor-signup-email"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={vendorSignupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="Create a password" 
                              className="pl-10" 
                              data-testid="input-vendor-signup-password"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={vendorSignupForm.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Your business name" 
                              className="pl-10" 
                              data-testid="input-vendor-business-name"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={vendorSignupForm.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-vendor-business-type">
                              <SelectValue placeholder="Select your business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hostel">Hostel / Accommodation</SelectItem>
                            <SelectItem value="tutoring">Tutoring / Coaching</SelectItem>
                            <SelectItem value="events">Events / Study Groups</SelectItem>
                            <SelectItem value="notes">Notes Seller</SelectItem>
                            <SelectItem value="transport">Transport Services</SelectItem>
                            <SelectItem value="food">Food / Catering</SelectItem>
                            <SelectItem value="other">Other Services</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {authError && (
                    <div className="text-sm text-red-500" data-testid="error-message">{authError}</div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    data-testid="button-vendor-signup"
                  >
                    {isSubmitting ? "Creating account..." : "List Your Service"}
                  </Button>
                </form>
              </Form>
            )}

            {/* Business login options */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin('google')}
                data-testid="button-vendor-google"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-4 h-4 mr-2"
                />
                Continue with Google Business
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}