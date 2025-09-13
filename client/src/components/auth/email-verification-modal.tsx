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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Mail, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const verificationSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits").regex(/^\d+$/, "Code must contain only numbers"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
  onVerificationComplete?: () => void;
}

export default function EmailVerificationModal({ 
  open, 
  onOpenChange, 
  email = "john@university.edu",
  onVerificationComplete 
}: EmailVerificationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const { toast } = useToast();

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerificationFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to verify the code
      console.log("Verifying code:", data.code);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Email Verified!",
        description: "Your account has been successfully verified.",
      });
      
      // Call completion callback and close modal
      onVerificationComplete?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error verifying code:", error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Here you would typically make an API call to resend the verification email
      console.log("Resending verification email to:", email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Email Sent!",
        description: "We've sent another verification link to your email.",
      });
    } catch (error) {
      console.error("Error resending email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend verification email. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenEmailApp = () => {
    // Try to open the default email client
    window.location.href = "mailto:";
  };

  // Split the verification code into individual digits for display
  const codeValue = form.watch("code");
  const codeDigits = Array.from({ length: 6 }, (_, i) => codeValue[i] || "");

  const handleCodeChange = (value: string, index: number) => {
    const newCode = codeDigits.slice();
    newCode[index] = value.slice(-1); // Only take the last character
    const newCodeString = newCode.join("");
    form.setValue("code", newCodeString);
    
    // Auto-focus next input if current one is filled
    if (value && index < 5) {
      const nextInput = document.querySelector(`[data-testid="code-input-${index + 1}"]`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-center flex-1" data-testid="heading-verify-email">
            Verify Your Email
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onOpenChange(false)}
            data-testid="button-close-verification-modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Email Sent Message */}
          <div className="text-center space-y-2">
            <p className="text-foreground" data-testid="text-email-sent">
              We sent a verification link to
            </p>
            <p className="font-medium text-foreground" data-testid="text-email-address">
              {email}
            </p>
            <p className="text-muted-foreground text-sm" data-testid="text-verification-instructions">
              Click the link to verify your account and get started
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleOpenEmailApp}
              data-testid="button-open-email-app"
            >
              Open Email App
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleResendEmail}
              disabled={isResending}
              data-testid="button-resend-email"
            >
              {isResending ? "Sending..." : "Resend"}
            </Button>
          </div>

          {/* Spam Message */}
          <div className="text-center text-sm text-muted-foreground">
            <span>Didn't receive? Check spam or </span>
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={handleResendEmail}
              disabled={isResending}
              data-testid="button-try-again"
            >
              try again
            </Button>
          </div>

          {/* Manual Code Entry */}
          <div className="text-center">
            <Button
              variant="link"
              className="text-sm"
              onClick={() => setShowCodeInput(!showCodeInput)}
              data-testid="button-enter-code-manually"
            >
              Enter code manually
            </Button>
          </div>

          {/* Code Input Section */}
          {showCodeInput && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div className="flex justify-center gap-2">
                          {Array.from({ length: 6 }, (_, index) => (
                            <Input
                              key={index}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              className="w-12 h-12 text-center text-lg font-medium"
                              value={codeDigits[index]}
                              onChange={(e) => handleCodeChange(e.target.value, index)}
                              onKeyDown={(e) => {
                                // Handle backspace
                                if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
                                  const prevInput = document.querySelector(`[data-testid="code-input-${index - 1}"]`) as HTMLInputElement;
                                  prevInput?.focus();
                                }
                              }}
                              data-testid={`code-input-${index}`}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || codeValue.length !== 6}
                  data-testid="button-verify-continue"
                >
                  {isSubmitting ? "Verifying..." : "Verify & Continue"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}