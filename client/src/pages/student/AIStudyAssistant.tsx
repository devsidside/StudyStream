import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/services/authService";
import { apiRequest } from "@/services/api";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import RatingStars from "@/components/common/rating-stars";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle, 
  Star,
  FileText,
  Image,
  Archive,
  ExternalLink,
  Calendar,
  User,
  BookOpen,
  MapPin
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NoteDetail() {
  const params = useParams();
  const noteId = parseInt(params.id as string);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");

  // Fetch note details
  const { data: note, isLoading: noteLoading } = useQuery({
    queryKey: ['/api/notes', noteId],
    enabled: !!noteId,
  });

  // Fetch ratings
  const { data: ratings } = useQuery({
    queryKey: ['/api/notes', noteId, 'ratings'],
    enabled: !!noteId,
  });

  // Fetch comments
  const { data: comments } = useQuery({
    queryKey: ['/api/notes', noteId, 'comments'],
    enabled: !!noteId,
  });

  // Check if note is saved
  const { data: savedStatus } = useQuery({
    queryKey: ['/api/notes', noteId, 'saved'],
    enabled: !!noteId && !!isAuthenticated,
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/notes/${noteId}/download`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes', noteId] });
    },
  });

  // Save/unsave mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (savedStatus?.isSaved) {
        return apiRequest('DELETE', `/api/notes/${noteId}/save`);
      } else {
        return apiRequest('POST', `/api/notes/${noteId}/save`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes', noteId, 'saved'] });
      toast({
        title: savedStatus?.isSaved ? "Note Unsaved" : "Note Saved",
        description: savedStatus?.isSaved ? "Note removed from your saved list" : "Note added to your saved list",
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
        description: "Failed to update saved status",
        variant: "destructive",
      });
    },
  });

  // Rating mutation
  const ratingMutation = useMutation({
    mutationFn: async (data: { rating: number; review?: string }) => {
      return apiRequest('POST', `/api/notes/${noteId}/ratings`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes', noteId, 'ratings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes', noteId] });
      setNewRating(0);
      setNewReview("");
      toast({
        title: "Rating Added",
        description: "Thank you for your feedback!",
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
        description: "Failed to add rating",
        variant: "destructive",
      });
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', `/api/notes/${noteId}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes', noteId, 'comments'] });
      setNewComment("");
      toast({
        title: "Comment Added",
        description: "Your comment has been posted",
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
        description: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const handleDownload = () => {
    downloadMutation.mutate();
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to save notes",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate();
  };

  const handleRatingSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to rate notes",
        variant: "destructive",
      });
      return;
    }
    if (newRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }
    ratingMutation.mutate({ rating: newRating, review: newReview });
  };

  const handleCommentSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }
    if (!newComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }
    commentMutation.mutate(newComment);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: note?.title,
        text: note?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Note link copied to clipboard",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (mimeType.includes('image')) return <Image className="w-5 h-5 text-green-500" />;
    if (mimeType.includes('zip')) return <Archive className="w-5 h-5 text-purple-500" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  if (noteLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-12 bg-muted rounded w-3/4"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-96 bg-muted rounded"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-64 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">Note Not Found</h1>
            <p className="text-muted-foreground mb-8">The note you're looking for doesn't exist or has been removed.</p>
            <Link href="/browse">
              <Button data-testid="button-browse-notes">Browse Notes</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/browse">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          {/* Content Header */}
          <Card className="mb-8" data-testid="card-content-header">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" data-testid="badge-content-type">
                      {note.contentType?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                    <Badge variant="outline" data-testid="badge-subject">
                      {note.subject?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold" data-testid="text-note-title">{note.title}</h1>
                  
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    {note.uploader && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span data-testid="text-uploader">
                          By {note.uploader.firstName} {note.uploader.lastName}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span data-testid="text-upload-date">
                        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <RatingStars rating={parseFloat(note.averageRating)} />
                    <span className="text-sm text-muted-foreground" data-testid="text-rating-summary">
                      {note.totalRatings} reviews • {note.totalViews} views • {note.totalDownloads} downloads
                    </span>
                  </div>

                  {note.courseCode && (
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span data-testid="text-course-info">
                          {note.courseCode} • {note.university}
                        </span>
                      </div>
                      {note.professor && (
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span data-testid="text-professor">{note.professor}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleDownload} disabled={downloadMutation.isPending} data-testid="button-download">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                  <Button variant="outline" onClick={handleSave} disabled={saveMutation.isPending} data-testid="button-save">
                    <Heart className={`w-4 h-4 mr-2 ${savedStatus?.isSaved ? 'fill-current' : ''}`} />
                    {savedStatus?.isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={handleShare} data-testid="button-share">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Files and Preview */}
            <div className="lg:col-span-2 space-y-6">
              {/* File List */}
              <Card data-testid="card-file-list">
                <CardHeader>
                  <CardTitle>Files</CardTitle>
                </CardHeader>
                <CardContent>
                  {note.files && note.files.length > 0 ? (
                    <div className="space-y-3">
                      {note.files.map((file: any, index: number) => (
                        <div
                          key={file.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedFileIndex === index ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedFileIndex(index)}
                          data-testid={`file-item-${index}`}
                        >
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.mimeType)}
                            <div>
                              <p className="font-medium text-sm">{file.originalName}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.fileSize)}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" data-testid={`button-download-file-${index}`}>
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" data-testid={`button-preview-file-${index}`}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground" data-testid="text-no-files">No files available</p>
                  )}
                </CardContent>
              </Card>

              {/* File Preview */}
              {note.files && note.files.length > 0 && (
                <Card data-testid="card-file-preview">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
                      <div className="space-y-4">
                        {getFileIcon(note.files[selectedFileIndex]?.mimeType)}
                        <div>
                          <p className="font-medium" data-testid="text-preview-filename">
                            {note.files[selectedFileIndex]?.originalName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Preview not available for this file type
                          </p>
                        </div>
                        <Button size="sm" variant="outline" data-testid="button-open-file">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open File
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Details and Actions */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card data-testid="card-quick-info">
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Files:</span>
                    <span data-testid="text-total-files">{note.files?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Downloads:</span>
                    <span data-testid="text-downloads">{note.totalDownloads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Views:</span>
                    <span data-testid="text-views">{note.totalViews}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Updated:</span>
                    <span data-testid="text-last-updated">
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <Card data-testid="card-tags">
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" data-testid={`tag-${index}`}>
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12">
            <Tabs defaultValue="content" data-testid="tabs-details">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
                <TabsTrigger value="details" data-testid="tab-details">Details</TabsTrigger>
                <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews ({ratings?.length || 0})</TabsTrigger>
                <TabsTrigger value="comments" data-testid="tab-comments">Comments ({comments?.length || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-6">
                <Card data-testid="card-description">
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {note.description ? (
                      <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                        {note.description}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic" data-testid="text-no-description">
                        No description provided
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <Card data-testid="card-metadata">
                  <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Subject:</span>
                        <p className="text-muted-foreground mt-1" data-testid="text-subject">
                          {note.subject?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Content Type:</span>
                        <p className="text-muted-foreground mt-1" data-testid="text-content-type">
                          {note.contentType?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">University:</span>
                        <p className="text-muted-foreground mt-1" data-testid="text-university">{note.university}</p>
                      </div>
                      <div>
                        <span className="font-medium">Course Code:</span>
                        <p className="text-muted-foreground mt-1" data-testid="text-course-code">
                          {note.courseCode || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Professor:</span>
                        <p className="text-muted-foreground mt-1" data-testid="text-professor-detail">
                          {note.professor || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Academic Year:</span>
                        <p className="text-muted-foreground mt-1" data-testid="text-academic-year">
                          {note.academicYear || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {/* Add Rating Form */}
                  {isAuthenticated && (
                    <Card data-testid="card-add-rating">
                      <CardHeader>
                        <CardTitle>Add Your Rating</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Rating</label>
                          <RatingStars
                            rating={newRating}
                            interactive
                            onRatingChange={setNewRating}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Review (optional)</label>
                          <Textarea
                            placeholder="Share your thoughts about this content..."
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            className="mt-2"
                            data-testid="textarea-review"
                          />
                        </div>
                        <Button 
                          onClick={handleRatingSubmit}
                          disabled={ratingMutation.isPending || newRating === 0}
                          data-testid="button-submit-rating"
                        >
                          {ratingMutation.isPending ? 'Submitting...' : 'Submit Rating'}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Ratings List */}
                  <div className="space-y-4">
                    {ratings && ratings.length > 0 ? (
                      ratings.map((rating: any) => (
                        <Card key={rating.id} data-testid={`rating-${rating.id}`}>
                          <CardContent className="pt-6">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {rating.user?.firstName?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-medium text-sm" data-testid={`rating-author-${rating.id}`}>
                                    {rating.user?.firstName} {rating.user?.lastName}
                                  </span>
                                  <RatingStars rating={rating.rating} size="sm" />
                                  <span className="text-xs text-muted-foreground" data-testid={`rating-date-${rating.id}`}>
                                    {formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                                {rating.review && (
                                  <p className="text-sm text-muted-foreground" data-testid={`rating-review-${rating.id}`}>
                                    {rating.review}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card data-testid="card-no-ratings">
                        <CardContent className="pt-6 text-center">
                          <p className="text-muted-foreground">No ratings yet. Be the first to rate this content!</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-6">
                <div className="space-y-6">
                  {/* Add Comment Form */}
                  {isAuthenticated && (
                    <Card data-testid="card-add-comment">
                      <CardHeader>
                        <CardTitle>Add Comment</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea
                          placeholder="Ask a question or share your thoughts..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          data-testid="textarea-comment"
                        />
                        <Button 
                          onClick={handleCommentSubmit}
                          disabled={commentMutation.isPending || !newComment.trim()}
                          data-testid="button-submit-comment"
                        >
                          {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments && comments.length > 0 ? (
                      comments.map((comment: any) => (
                        <Card key={comment.id} data-testid={`comment-${comment.id}`}>
                          <CardContent className="pt-6">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {comment.user?.firstName?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-medium text-sm" data-testid={`comment-author-${comment.id}`}>
                                    {comment.user?.firstName} {comment.user?.lastName}
                                  </span>
                                  <span className="text-xs text-muted-foreground" data-testid={`comment-date-${comment.id}`}>
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                                <p className="text-sm" data-testid={`comment-content-${comment.id}`}>
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card data-testid="card-no-comments">
                        <CardContent className="pt-6 text-center">
                          <p className="text-muted-foreground">No comments yet. Start the discussion!</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
