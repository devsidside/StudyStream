import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, GraduationCap, Building2 } from "lucide-react";

export default function StudentProfile() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-8" data-testid="text-profile-title">Student Profile</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>First Name</Label>
                <Input value={profile?.first_name || ""} readOnly data-testid="input-firstname" />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={profile?.last_name || ""} readOnly data-testid="input-lastname" />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input value={profile?.email || ""} readOnly data-testid="input-email" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  University
                </Label>
                <Input value={profile?.university || ""} readOnly data-testid="input-university" />
              </div>
              <div>
                <Label>Course</Label>
                <Input value={profile?.course || ""} readOnly data-testid="input-course" />
              </div>
              <div>
                <Label>Year</Label>
                <Input value={profile?.year || ""} readOnly data-testid="input-year" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button data-testid="button-edit-profile">Edit Profile</Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
