import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3" data-testid="text-settings-title">
          <SettingsIcon className="h-8 w-8" />
          Admin Settings
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to sign up
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-registration" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify email before access
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-email-verification" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Vendor Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Vendors require admin approval
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-vendor-approval" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-approve Notes</Label>
                  <p className="text-sm text-muted-foreground">
                    Notes are published immediately
                  </p>
                </div>
                <Switch data-testid="switch-auto-approve" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to comment on content
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-comments" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Ratings</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to rate content
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-ratings" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Platform Name</Label>
                <Input defaultValue="Campus Hub" data-testid="input-platform-name" />
              </div>
              <div>
                <Label>Support Email</Label>
                <Input defaultValue="support@campushub.com" type="email" data-testid="input-support-email" />
              </div>
              <div>
                <Label>Max Upload Size (MB)</Label>
                <Input defaultValue="50" type="number" data-testid="input-max-upload" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email for platform updates
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-email-notifications" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Admin Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for admin actions
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-admin-alerts" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button data-testid="button-save-settings">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
