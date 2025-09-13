import { useState } from "react";
import { Button } from "@/components/ui/button";
import SignupModal from "./signup-modal";
import LoginModal from "./login-modal";
import EmailVerificationModal from "./email-verification-modal";

export default function AuthButtons() {
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
    window.location.reload(); // Simple reload for demo purposes
  };

  return (
    <>
      <div className="flex gap-4">
        <Button 
          variant="ghost" 
          onClick={() => setShowLogin(true)}
          data-testid="button-sign-in"
        >
          Sign In
        </Button>
        <Button 
          onClick={() => setShowSignup(true)}
          data-testid="button-get-started"
        >
          Get Started
        </Button>
      </div>

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
    </>
  );
}