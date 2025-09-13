import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/common/rating-stars";
import { Download, Eye, Heart, MessageCircle, User, Calendar, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Note {
  id: number;
  title: string;
  description?: string;
  subject: string;
  contentType: string;
  university: string;
  courseCode?: string;
  professor?: string;
  totalDownloads: number;
  totalViews: number;
  averageRating: string;
  totalRatings: number;
  tags?: string[];
  createdAt: string;
  uploader?: {
    firstName?: string;
    lastName?: string;
  };
}

interface NoteCardProps {
  note: Note;
  featured?: boolean;
  className?: string;
}

export default function NoteCard({ note, featured = false, className }: NoteCardProps) {
  const formatSubject = (subject: string) => {
    return subject.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatContentType = (type: string) => {
    return type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return '💻';
      case 'lecture-notes':
        return '📝';
      case 'study-guide':
        return '📖';
      case 'past-paper':
        return '📋';
      case 'lab-report':
        return '🧪';
      case 'assignment':
        return '📄';
      default:
        return '📝';
    }
  };

  return (
    <Card className={cn("hover-lift transition-all duration-300", featured && "border-primary/20", className)} data-testid={`note-card-${note.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getContentTypeIcon(note.contentType)}</span>
              <Badge variant="secondary" className="text-xs" data-testid={`badge-content-type-${note.id}`}>
                {formatContentType(note.contentType)}
              </Badge>
              <Badge variant="outline" className="text-xs" data-testid={`badge-subject-${note.id}`}>
                {formatSubject(note.subject)}
              </Badge>
            </div>
            
            <Link href={`/notes/${note.id}`}>
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors cursor-pointer" data-testid={`link-note-title-${note.id}`}>
                {note.title}
              </h3>
            </Link>
            
            {note.description && (
              <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${note.id}`}>
                {note.description}
              </p>
            )}
          </div>
          
          {featured && (
            <Badge className="bg-destructive text-destructive-foreground" data-testid={`badge-trending-${note.id}`}>
              🔥 Trending
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Course Info */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span data-testid={`text-course-${note.id}`}>
              {note.courseCode && `${note.courseCode} • `}{note.university}
            </span>
          </div>
          {note.professor && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span data-testid={`text-professor-${note.id}`}>{note.professor}</span>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <RatingStars
            rating={parseFloat(note.averageRating)}
            size="sm"
            className="text-xs"
          />
          <span className="text-xs text-muted-foreground" data-testid={`text-rating-count-${note.id}`}>
            ({note.totalRatings} reviews)
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span data-testid={`text-downloads-${note.id}`}>{note.totalDownloads}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span data-testid={`text-views-${note.id}`}>{note.totalViews}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span data-testid={`text-created-${note.id}`}>
              {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Author */}
        {note.uploader && (
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-primary" />
            </div>
            <span className="text-muted-foreground" data-testid={`text-author-${note.id}`}>
              By {note.uploader.firstName} {note.uploader.lastName}
            </span>
          </div>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1" data-testid={`tags-${note.id}`}>
            {note.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5" data-testid={`tag-${note.id}-${index}`}>
                #{tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" data-testid={`button-save-${note.id}`}>
              <Heart className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="ghost" data-testid={`button-comment-${note.id}`}>
              <MessageCircle className="w-4 h-4 mr-1" />
              Comment
            </Button>
          </div>
          
          <Link href={`/notes/${note.id}`}>
            <Button size="sm" data-testid={`button-view-${note.id}`}>
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
