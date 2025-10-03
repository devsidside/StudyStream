import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X, Eye, EyeOff, Lightbulb, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  university: z.string().min(1, "Please select a university"),
  program: z.string().min(1, "Please select your program"),
  year: z.string().min(1, "Please select your year"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and privacy policy"),
  emailDigest: z.boolean(),
  ageConsent: z.boolean().refine(val => val === true, "You must confirm you are 18+ or have parental consent"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginClick?: () => void;
  onSignupSuccess?: (email: string) => void;
}

export default function SignupModal({ open, onOpenChange, onLoginClick, onSignupSuccess }: SignupModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [authError, setAuthError] = useState<string | null>(null);
  const { signUp, signInWithOAuth } = useAuth();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      university: "",
      program: "",
      year: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      emailDigest: false,
      ageConsent: false,
    },
  });

  const universities = [
    "University of Technology",
    "Harvard University",
    "Stanford University", 
    "MIT",
    "University of California, Berkeley",
    "University of Oxford",
    "University of Cambridge",
    "Yale University",
    "Princeton University",
    "Other"
  ];

  const programs = [
    "Computer Science",
    "Engineering",
    "Business Administration",
    "Biology",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Psychology",
    "Economics",
    "Literature",
    "History",
    "Other"
  ];

  const years = [
    "Year 1",
    "Year 2", 
    "Year 3",
    "Year 4",
    "Graduate",
    "PhD"
  ];

  const watchedPassword = form.watch("password");
  const watchedConfirmPassword = form.watch("confirmPassword");

  useEffect(() => {
    if (watchedPassword) {
      const hasUpperCase = /[A-Z]/.test(watchedPassword);
      const hasLowerCase = /[a-z]/.test(watchedPassword);
      const hasNumbers = /\d/.test(watchedPassword);
      const hasMinLength = watchedPassword.length >= 8;

      if (hasMinLength && hasUpperCase && hasLowerCase && hasNumbers) {
        setPasswordStrength('strong');
      } else if (hasMinLength && (hasUpperCase || hasLowerCase) && hasNumbers) {
        setPasswordStrength('medium');
      } else {
        setPasswordStrength('weak');
      }
    }
  }, [watchedPassword]);

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'strong': return '💪 Strong';
      case 'medium': return '⚡ Medium';
      default: return '❌ Weak';
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const metadata = {
        fullName: data.fullName,
        university: data.university,
        program: data.program,
        year: data.year,
        emailDigest: data.emailDigest,
      };
      
      const { error } = await signUp(data.email, data.password, metadata);
      
      if (error) {
        setAuthError(error.message || "Failed to create account. Please try again.");
        return;
      }
      
      // Close modal and trigger verification flow
      onOpenChange(false);
      onSignupSuccess?.(data.email);
      form.reset();
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1" data-testid="text-step-indicator">
              📝 SIGN UP - STEP 1 OF 2
            </div>
            <DialogTitle className="text-xl font-semibold" data-testid="heading-create-account">
              Create Your Account
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onOpenChange(false)}
            data-testid="button-close-modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="text-muted-foreground text-sm mb-6" data-testid="text-description">
          Join thousands of students who are already using StudyConnect to enhance their academic experience.
        </div>

        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6" data-testid="error-message">
            {authError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground" data-testid="heading-basic-info">
                BASIC INFORMATION
              </h3>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        data-testid="input-full-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@university.edu"
                        {...field}
                        data-testid="input-email"
                      />
                    </FormControl>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Lightbulb className="h-3 w-3" />
                      <span>Use your university email for instant verification</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-university">
                          <SelectValue placeholder="University of Technology" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {universities.map((university) => (
                          <SelectItem key={university} value={university}>
                            {university}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Search className="h-3 w-3" />
                      <span>Not listed? Add your university</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program & Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-program">
                            <SelectValue placeholder="Computer Science" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="opacity-0">Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-year">
                            <SelectValue placeholder="Year 3" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••••"
                          {...field}
                          data-testid="input-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    {watchedPassword && (
                      <div className="text-xs mt-1">
                        <div className={`mb-1 ${getPasswordStrengthColor()}`}>
                          Password Strength: {getPasswordStrengthText()}
                        </div>
                        <div className="flex gap-4">
                          <span className={watchedPassword.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}>
                            ✅ 8+ characters
                          </span>
                          <span className={/[A-Z]/.test(watchedPassword) && /[a-z]/.test(watchedPassword) ? 'text-green-600' : 'text-muted-foreground'}>
                            ✅ Upper & lower case
                          </span>
                          <span className={/\d/.test(watchedPassword) ? 'text-green-600' : 'text-muted-foreground'}>
                            ✅ Numbers
                          </span>
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••••••••"
                          {...field}
                          data-testid="input-confirm-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          data-testid="button-toggle-confirm-password"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    {watchedConfirmPassword && watchedPassword && (
                      <div className={`text-xs mt-1 ${watchedPassword === watchedConfirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                        {watchedPassword === watchedConfirmPassword ? '✅ Passwords match' : '❌ Passwords don\'t match'}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-terms"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        I agree to the Terms of Service and Privacy Policy
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailDigest"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-email-digest"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        Send me weekly digest emails (optional)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ageConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-age-consent"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        I'm 18+ or have parental consent
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              data-testid="button-create-account"
            >
              {isSubmitting ? "Creating Account..." : "Create Account →"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin('google')}
                data-testid="button-google-signup"
              >
                🔵 Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin('facebook')}
                data-testid="button-facebook-signup"
              >
                📘 Continue with Facebook
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={onLoginClick}
                data-testid="button-login-link"
              >
                Login here
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}