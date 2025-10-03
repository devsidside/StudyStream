import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Building2, User, MapPin, BookOpen, Calendar, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Student profile schema
const studentProfileSchema = z.object({
  role: z.literal('student'),
  university: z.string().min(1, "University is required"),
  course: z.string().min(1, "Course is required"),
  year: z.string().min(1, "Year is required"),
});

// Vendor profile schema
const vendorProfileSchema = z.object({
  role: z.literal('vendor'),
  businessType: z.string().min(1, "Business type is required"),
  businessName: z.string().min(1, "Business name is required"),
});

type StudentProfileData = z.infer<typeof studentProfileSchema>;
type VendorProfileData = z.infer<typeof vendorProfileSchema>;
type ProfileData = StudentProfileData | VendorProfileData;

interface OAuthRoleSelectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export default function OAuthRoleSelection({ open, onOpenChange, onComplete }: OAuthRoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'vendor' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateProfile } = useAuth();

  // Student form
  const studentForm = useForm<StudentProfileData>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      role: 'student',
      university: "",
      course: "",
      year: "",
    },
  });

  // Vendor form
  const vendorForm = useForm<VendorProfileData>({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: {
      role: 'vendor',
      businessType: "",
      businessName: "",
    },
  });

  const handleRoleSelection = (role: 'student' | 'vendor') => {
    setSelectedRole(role);
    setError(null);
  };

  const handleStudentSubmit = async (data: StudentProfileData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await updateProfile({
        role: data.role,
        university: data.university,
        course: data.course,
        year: data.year,
      });

      if (error) {
        setError(error.message || "Failed to save profile. Please try again.");
        return;
      }

      onComplete();
      onOpenChange(false);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVendorSubmit = async (data: VendorProfileData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await updateProfile({
        role: data.role,
        business_type: data.businessType,
        business_name: data.businessName,
      });

      if (error) {
        setError(error.message || "Failed to save profile. Please try again.");
        return;
      }

      onComplete();
      onOpenChange(false);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSelection = () => {
    setSelectedRole(null);
    setError(null);
    studentForm.reset();
    vendorForm.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Complete Your Profile
          </DialogTitle>
          <DialogDescription className="text-center">
            Welcome {user?.email}! Please tell us a bit more about yourself to personalize your experience.
          </DialogDescription>
        </DialogHeader>

        {!selectedRole && (
          <div className="space-y-4 mt-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium mb-2">I am a...</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-primary"
                onClick={() => handleRoleSelection('student')}
                data-testid="card-select-student"
              >
                <CardHeader className="text-center pb-3">
                  <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">Student</CardTitle>
                  <CardDescription>
                    Looking for study materials, accommodation, tutoring, and academic resources
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Access study notes and resources</li>
                    <li>• Find accommodation near campus</li>
                    <li>• Book tutors and coaching</li>
                    <li>• Join study groups and events</li>
                  </ul>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-primary"
                onClick={() => handleRoleSelection('vendor')}
                data-testid="card-select-vendor"
              >
                <CardHeader className="text-center pb-3">
                  <div className="w-16 h-16 mx-auto mb-3 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Service Provider</CardTitle>
                  <CardDescription>
                    Offering services like accommodation, tutoring, events, or study materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• List your accommodation</li>
                    <li>• Offer tutoring services</li>
                    <li>• Organize events and workshops</li>
                    <li>• Sell study materials</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedRole === 'student' && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Student Information
              </h3>
              <Button variant="outline" size="sm" onClick={resetSelection}>
                Back
              </Button>
            </div>

            <Form {...studentForm}>
              <form onSubmit={studentForm.handleSubmit(handleStudentSubmit)} className="space-y-4">
                <FormField
                  control={studentForm.control}
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
                            data-testid="input-oauth-university"
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
                    control={studentForm.control}
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
                              data-testid="input-oauth-course"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={studentForm.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-oauth-year">
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

                {error && (
                  <div className="text-sm text-red-500" data-testid="error-message">{error}</div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                  data-testid="button-complete-student-profile"
                >
                  {isSubmitting ? "Saving..." : "Complete Profile"}
                </Button>
              </form>
            </Form>
          </div>
        )}

        {selectedRole === 'vendor' && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Business Information
              </h3>
              <Button variant="outline" size="sm" onClick={resetSelection}>
                Back
              </Button>
            </div>

            <Form {...vendorForm}>
              <form onSubmit={vendorForm.handleSubmit(handleVendorSubmit)} className="space-y-4">
                <FormField
                  control={vendorForm.control}
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
                            data-testid="input-oauth-business-name"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={vendorForm.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-oauth-business-type">
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

                {error && (
                  <div className="text-sm text-red-500" data-testid="error-message">{error}</div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                  data-testid="button-complete-vendor-profile"
                >
                  {isSubmitting ? "Saving..." : "Complete Profile"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}