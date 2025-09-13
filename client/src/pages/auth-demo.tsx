import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignupModal from "@/components/auth/signup-modal";
import LoginModal from "@/components/auth/login-modal";
import EmailVerificationModal from "@/components/auth/email-verification-modal";

export default function AuthDemo() {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const handleSignupSuccess = (email: string) => {
    setVerificationEmail(email);
    setShowVerification(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleVerificationComplete = () => {
    console.log("Email verification completed!");
    // Here you would typically redirect to the dashboard or complete the onboarding
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Authentication Demo</CardTitle>
          <CardDescription>
            Test the sign-up, login, and email verification modals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => setShowSignup(true)}
            data-testid="button-demo-signup"
          >
            Open Sign Up Modal
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowLogin(true)}
            data-testid="button-demo-login"
          >
            Open Login Modal
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => {
              setVerificationEmail("demo@university.edu");
              setShowVerification(true);
            }}
            data-testid="button-demo-verification"
          >
            Open Email Verification Modal
          </Button>
        </CardContent>
      </Card>

      {/* Auth Modals */}
      <SignupModal
        open={showSignup}
        onOpenChange={setShowSignup}
        onLoginClick={handleSwitchToLogin}
        onSignupSuccess={handleSignupSuccess}
      />

      <LoginModal
        open={showLogin}
        onOpenChange={setShowLogin}
        onSignupClick={handleSwitchToSignup}
      />

      <EmailVerificationModal
        open={showVerification}
        onOpenChange={setShowVerification}
        email={verificationEmail}
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
}