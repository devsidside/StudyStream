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
import { Form } from "@/components/ui/form";
import { FormTextField, FormCheckboxField } from "@/components/form";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignupClick?: () => void;
}

export default function LoginModal({ open, onOpenChange, onSignupClick }: LoginModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signInWithOAuth } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        setAuthError(error.message || "Failed to sign in. Please check your credentials.");
        return;
      }
      
      // Close modal on success
      onOpenChange(false);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-center flex-1" data-testid="heading-login">
            Welcome Back
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onOpenChange(false)}
            data-testid="button-close-login-modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4" data-testid="error-message">
            {authError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormTextField
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="john@university.edu"
              testId="input-login-email"
            />

            <FormTextField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••••••••"
              testId="input-login-password"
            />

            <FormCheckboxField
              control={form.control}
              name="rememberMe"
              label="Remember me"
              testId="checkbox-remember-me"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              data-testid="button-login"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
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
                data-testid="button-google-login"
              >
                🔵 Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin('facebook')}
                data-testid="button-facebook-login"
              >
                📘 Facebook
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="link"
                className="text-sm"
                data-testid="button-forgot-password"
              >
                Forgot your password?
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={onSignupClick}
                data-testid="button-signup-link"
              >
                Sign Up
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}