import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import UploadZone from "@/components/notes/upload-zone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Save, Eye, Upload } from "lucide-react";
import { Link, useLocation } from "wouter";

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  courseCode: z.string().optional(),
  professor: z.string().optional(),
  university: z.string().min(1, "University is required"),
  academicYear: z.string().optional(),
  semester: z.string().optional(),
  contentType: z.string().min(1, "Content type is required"),
  tags: z.string().optional(),
  visibility: z.enum(["public", "university", "course", "private"]).default("public"),
  allowDownloads: z.boolean().default(true),
  allowComments: z.boolean().default(true),
  allowRatings: z.boolean().default(true),
  license: z.string().default("cc-attribution"),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  uploadError?: string;
  id?: string;
}

export default function UploadNotes() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      courseCode: "",
      professor: "",
      university: "",
      academicYear: "",
      semester: "",
      contentType: "",
      tags: "",
      visibility: "public",
      allowDownloads: true,
      allowComments: true,
      allowRatings: true,
      license: "cc-attribution",
    },
  });

  // Update file progress
  const updateFileProgress = (fileId: string, progress: number) => {
    setSelectedFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId ? { ...file, uploadProgress: progress } : file
      )
    );
  };

  // Update file status
  const updateFileStatus = (fileId: string, status: 'pending' | 'uploading' | 'success' | 'error', error?: string) => {
    setSelectedFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId ? { ...file, uploadStatus: status, uploadError: error } : file
      )
    );
  };

  // Upload individual file with progress tracking
  const uploadSingleFile = (file: FileWithPreview, data: UploadFormData): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      
      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formData.append(key, value.toString());
        }
      });

      // Add single file
      formData.append('files', file);
      formData.append('fileId', file.id || '');

      // Update status to uploading
      updateFileStatus(file.id!, 'uploading');

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          updateFileProgress(file.id!, progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            updateFileStatus(file.id!, 'success');
            resolve(result);
          } catch {
            updateFileStatus(file.id!, 'success');
            resolve(xhr.responseText);
          }
        } else {
          updateFileStatus(file.id!, 'error', `Upload failed: ${xhr.status}`);
          reject(new Error(`${xhr.status}: ${xhr.responseText}`));
        }
      });

      // Handle network errors
      xhr.addEventListener('error', () => {
        updateFileStatus(file.id!, 'error', 'Network error occurred');
        reject(new Error('Network error occurred during upload'));
      });

      // Handle timeout
      xhr.addEventListener('timeout', () => {
        updateFileStatus(file.id!, 'error', 'Upload timed out');
        reject(new Error('Upload timed out. Please try again.'));
      });

      xhr.open('POST', '/api/notes');
      xhr.withCredentials = true;
      xhr.timeout = 300000; // 5 minutes timeout
      xhr.send(formData);
    });
  };

  // Upload all files individually
  const uploadAllFiles = async (data: UploadFormData) => {
    const results = [];
    const errors = [];
    
    for (const file of selectedFiles) {
      try {
        const result = await uploadSingleFile(file, data);
        results.push(result);
      } catch (error) {
        errors.push({ file: file.name, error });
      }
    }
    
    if (errors.length > 0) {
      throw new Error(`Failed to upload ${errors.length} file(s): ${errors.map(e => e.file).join(', ')}`);
    }
    
    return results[0]; // Return first result for navigation
  };

  const uploadMutation = useMutation({
    mutationFn: async (data: UploadFormData) => {
      return uploadAllFiles(data);
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Your notes have been uploaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setLocation(`/notes/${data.id}`);
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
        title: "Upload Failed",
        description: error.message || "Failed to upload notes. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    toast({
      title: "Unauthorized",
      description: "You need to log in to upload notes.",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  const onSubmit = (data: UploadFormData) => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }
    uploadMutation.mutate(data);
  };

  const handleSaveDraft = () => {
    // TODO: Implement draft saving
    toast({
      title: "Draft Saved",
      description: "Your draft has been saved locally.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/notes">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Upload Notes</h1>
              <p className="text-muted-foreground">Share Your Knowledge</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Upload Method */}
              <Card data-testid="card-upload-method">
                <CardHeader>
                  <CardTitle>Upload Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                      <span className="font-medium">Upload Files</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-muted"></div>
                      <span className="text-muted-foreground">Create Online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-muted"></div>
                      <span className="text-muted-foreground">Import from URL</span>
                    </div>
                  </div>
                  
                  <UploadZone 
                    files={selectedFiles}
                    onFilesChange={setSelectedFiles}
                    maxFiles={10}
                    isUploading={uploadMutation.isPending}
                  />
                </CardContent>
              </Card>

              {/* Content Details */}
              <Card data-testid="card-content-details">
                <CardHeader>
                  <CardTitle>Content Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Data Structures & Algorithms - Complete Notes" 
                            {...field}
                            data-testid="input-title"
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
                            placeholder="Comprehensive notes covering arrays, linked lists, stacks, queues, trees, and graphs. Includes examples, practice problems, and time complexity analysis. Perfect for final exam preparation."
                            className="resize-none"
                            rows={4}
                            {...field}
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-subject">
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="computer-science">Computer Science</SelectItem>
                              <SelectItem value="mathematics">Mathematics</SelectItem>
                              <SelectItem value="physics">Physics</SelectItem>
                              <SelectItem value="chemistry">Chemistry</SelectItem>
                              <SelectItem value="engineering">Engineering</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="biology">Biology</SelectItem>
                              <SelectItem value="psychology">Psychology</SelectItem>
                              <SelectItem value="economics">Economics</SelectItem>
                              <SelectItem value="literature">Literature</SelectItem>
                              <SelectItem value="history">History</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="courseCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="CS301" 
                              {...field}
                              data-testid="input-course-code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="professor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professor</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Prof. Johnson" 
                              {...field}
                              data-testid="input-professor"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="university"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>University *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="University of Technology" 
                              {...field}
                              data-testid="input-university"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="academicYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Year</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-academic-year">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2024-2025">2024-2025</SelectItem>
                              <SelectItem value="2023-2024">2023-2024</SelectItem>
                              <SelectItem value="2022-2023">2022-2023</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-semester">
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                              <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                              <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (help others find your content)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="algorithms datastructures final practice cs301" 
                            {...field}
                            data-testid="input-tags"
                          />
                        </FormControl>
                        <FormDescription>
                          Separate tags with spaces
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type *</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-testid="content-type-options">
                            {[
                              { value: "lecture-notes", label: "Lecture Notes" },
                              { value: "study-guide", label: "Study Guide" },
                              { value: "past-paper", label: "Past Paper" },
                              { value: "lab-report", label: "Lab Report" },
                              { value: "assignment", label: "Assignment" },
                              { value: "reference-material", label: "Reference Material" },
                            ].map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={option.value}
                                  checked={field.value === option.value}
                                  onCheckedChange={(checked) => {
                                    if (checked) field.onChange(option.value);
                                  }}
                                  data-testid={`checkbox-content-type-${option.value}`}
                                />
                                <Label htmlFor={option.value} className="text-sm">
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Sharing Settings */}
              <Card data-testid="card-sharing-settings">
                <CardHeader>
                  <CardTitle>Sharing Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="public" id="public" />
                                <Label htmlFor="public" data-testid="radio-public">
                                  Public (Everyone can view and download)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="university" id="university" />
                                <Label htmlFor="university" data-testid="radio-university">
                                  University Only (Students from your university)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="course" id="course" />
                                <Label htmlFor="course" data-testid="radio-course">
                                  Course Only (Students in same course)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="private" id="private" />
                                <Label htmlFor="private" data-testid="radio-private">
                                  Private (Only you and invited collaborators)
                                </Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Permissions</FormLabel>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <FormField
                        control={form.control}
                        name="allowDownloads"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-allow-downloads"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Allow downloads
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="allowComments"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-allow-comments"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Allow comments
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="allowRatings"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-allow-ratings"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Allow ratings
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="license"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cc-attribution" id="cc" />
                                <Label htmlFor="cc" data-testid="radio-cc">
                                  Creative Commons (Attribution)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all-rights-reserved" id="arr" />
                                <Label htmlFor="arr" data-testid="radio-arr">
                                  All Rights Reserved
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="public-domain" id="pd" />
                                <Label htmlFor="pd" data-testid="radio-pd">
                                  Public Domain
                                </Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleSaveDraft}
                  data-testid="button-save-draft"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  data-testid="button-preview"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  type="submit"
                  disabled={uploadMutation.isPending || selectedFiles.length === 0}
                  data-testid="button-upload-publish"
                >
                  {uploadMutation.isPending ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload & Publish
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
