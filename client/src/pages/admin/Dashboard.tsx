import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/services/authService";
import { apiRequest } from "@/services/api";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Edit,
  Trash2,
  Users,
  FileText,
  Building,
  BarChart3,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const advertisementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional(),
  linkUrl: z.string().url("Invalid URL").optional(),
  targetAudience: z.enum(["students", "vendors", "all"]).default("all"),
  placement: z.enum(["header", "sidebar", "content"]).default("content"),
  expiresAt: z.string().optional(),
});

type AdvertisementFormData = z.infer<typeof advertisementSchema>;

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingAd, setEditingAd] = useState<any>(null);

  const form = useForm<AdvertisementFormData>({
    resolver: zodResolver(advertisementSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      targetAudience: "all",
      placement: "content",
      expiresAt: "",
    },
  });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "Admin access required",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Fetch advertisements
  const { data: advertisements } = useQuery({
    queryKey: ['/api/admin/advertisements'],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Fetch platform analytics
  const { data: subjectStats } = useQuery({
    queryKey: ['/api/analytics/subjects'],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: notesData } = useQuery({
    queryKey: ['/api/notes', { limit: 1 }],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: vendorsData } = useQuery({
    queryKey: ['/api/vendors', { limit: 1 }],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Create advertisement mutation
  const createAdMutation = useMutation({
    mutationFn: async (data: AdvertisementFormData) => {
      return apiRequest('POST', '/api/admin/advertisements', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/advertisements'] });
      form.reset();
      toast({
        title: "Success",
        description: "Advertisement created successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create advertisement",
        variant: "destructive",
      });
    },
  });

  // Update advertisement mutation
  const updateAdMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AdvertisementFormData> }) => {
      return apiRequest('PUT', `/api/admin/advertisements/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/advertisements'] });
      setEditingAd(null);
      form.reset();
      toast({
        title: "Success",
        description: "Advertisement updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update advertisement",
        variant: "destructive",
      });
    },
  });

  // Delete advertisement mutation
  const deleteAdMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/admin/advertisements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/advertisements'] });
      toast({
        title: "Success",
        description: "Advertisement deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete advertisement",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AdvertisementFormData) => {
    if (editingAd) {
      updateAdMutation.mutate({ id: editingAd.id, data });
    } else {
      createAdMutation.mutate(data);
    }
  };

  const handleEdit = (ad: any) => {
    setEditingAd(ad);
    form.reset({
      title: ad.title,
      description: ad.description || "",
      imageUrl: ad.imageUrl || "",
      linkUrl: ad.linkUrl || "",
      targetAudience: ad.targetAudience,
      placement: ad.placement,
      expiresAt: ad.expiresAt ? new Date(ad.expiresAt).toISOString().split('T')[0] : "",
    });
  };

  const handleCancelEdit = () => {
    setEditingAd(null);
    form.reset();
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      deleteAdMutation.mutate(id);
    }
  };

  const toggleAdStatus = (ad: any) => {
    updateAdMutation.mutate({
      id: ad.id,
      data: { isActive: !ad.isActive }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage the StudyConnect platform
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card data-testid="card-total-notes">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-notes">
                      {notesData?.total || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Notes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-total-vendors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Building className="w-8 h-8 text-secondary" />
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-vendors">
                      {vendorsData?.total || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Vendors</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-total-subjects">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-subjects">
                      {subjectStats?.length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Active Subjects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-active-ads">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Settings className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-active-ads">
                      {advertisements?.filter((ad: any) => ad.isActive).length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Active Ads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="advertisements" data-testid="tabs-admin">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="advertisements" data-testid="tab-advertisements">Advertisements</TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="advertisements" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Create/Edit Advertisement Form */}
                <Card data-testid="card-ad-form">
                  <CardHeader>
                    <CardTitle>
                      {editingAd ? 'Edit Advertisement' : 'Create Advertisement'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Advertisement title" 
                                  {...field}
                                  data-testid="input-ad-title"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Advertisement description" 
                                  {...field}
                                  data-testid="textarea-ad-description"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/image.jpg" 
                                  {...field}
                                  data-testid="input-ad-image-url"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="linkUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com" 
                                  {...field}
                                  data-testid="input-ad-link-url"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="targetAudience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Target Audience</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-target-audience">
                                      <SelectValue placeholder="Select audience" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="students">Students Only</SelectItem>
                                    <SelectItem value="vendors">Vendors Only</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="placement"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Placement</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-placement">
                                      <SelectValue placeholder="Select placement" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="header">Header</SelectItem>
                                    <SelectItem value="sidebar">Sidebar</SelectItem>
                                    <SelectItem value="content">Content</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="expiresAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expires At (optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field}
                                  data-testid="input-ad-expires-at"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex space-x-2">
                          <Button 
                            type="submit"
                            disabled={createAdMutation.isPending || updateAdMutation.isPending}
                            data-testid="button-submit-ad"
                          >
                            {editingAd ? 'Update' : 'Create'} Advertisement
                          </Button>
                          {editingAd && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={handleCancelEdit}
                              data-testid="button-cancel-edit"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Advertisements List */}
                <Card data-testid="card-ads-list">
                  <CardHeader>
                    <CardTitle>Existing Advertisements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {advertisements && advertisements.length > 0 ? (
                        advertisements.map((ad: any) => (
                          <div
                            key={ad.id}
                            className="border rounded-lg p-4 space-y-3"
                            data-testid={`ad-item-${ad.id}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium" data-testid={`ad-title-${ad.id}`}>
                                  {ad.title}
                                </h4>
                                {ad.description && (
                                  <p className="text-sm text-muted-foreground mt-1" data-testid={`ad-description-${ad.id}`}>
                                    {ad.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={ad.isActive}
                                  onCheckedChange={() => toggleAdStatus(ad)}
                                  data-testid={`switch-ad-status-${ad.id}`}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(ad)}
                                  data-testid={`button-edit-ad-${ad.id}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(ad.id)}
                                  data-testid={`button-delete-ad-${ad.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <Badge variant="outline" data-testid={`ad-audience-${ad.id}`}>
                                {ad.targetAudience}
                              </Badge>
                              <Badge variant="outline" data-testid={`ad-placement-${ad.id}`}>
                                {ad.placement}
                              </Badge>
                              <span data-testid={`ad-created-${ad.id}`}>
                                Created {formatDistanceToNow(new Date(ad.createdAt), { addSuffix: true })}
                              </span>
                              {ad.expiresAt && (
                                <span data-testid={`ad-expires-${ad.id}`}>
                                  Expires {formatDistanceToNow(new Date(ad.expiresAt), { addSuffix: true })}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-8" data-testid="text-no-ads">
                          No advertisements created yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Subject Distribution */}
                <Card data-testid="card-subject-analytics">
                  <CardHeader>
                    <CardTitle>Subject Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subjectStats?.slice(0, 10).map((subject: any) => (
                        <div key={subject.subject} className="flex items-center justify-between">
                          <span className="capitalize text-sm" data-testid={`subject-${subject.subject}`}>
                            {subject.subject.replace('-', ' ')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ 
                                  width: `${(subject.count / (subjectStats[0]?.count || 1)) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-8 text-right" data-testid={`subject-count-${subject.subject}`}>
                              {subject.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Activity */}
                <Card data-testid="card-activity-analytics">
                  <CardHeader>
                    <CardTitle>Platform Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="font-medium">Total Content</span>
                        <span className="text-2xl font-bold" data-testid="text-total-content">
                          {(notesData?.total || 0) + (vendorsData?.total || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="font-medium">Active Advertisements</span>
                        <span className="text-2xl font-bold" data-testid="text-active-advertisements">
                          {advertisements?.filter((ad: any) => ad.isActive).length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="font-medium">Content Categories</span>
                        <span className="text-2xl font-bold" data-testid="text-content-categories">
                          {subjectStats?.length || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card data-testid="card-platform-settings">
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Platform Settings</h3>
                      <p className="text-muted-foreground">
                        Advanced platform configuration options will be available here.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
