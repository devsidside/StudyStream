import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/common/rating-stars";
import { 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Star, 
  Eye, 
  Download, 
  Users, 
  Clock, 
  Calendar,
  Wifi,
  Car,
  Coffee,
  BookOpen,
  GraduationCap,
  Save,
  Share
} from "lucide-react";
import { cn } from "@/utils/utils";

interface Service {
  id: number;
  name: string;
  description?: string;
  category: string;
  author?: string;
  price?: number;
  priceRange?: string;
  averageRating: string;
  totalRatings: number;
  isVerified: boolean;
  tags?: string[];
  views?: number;
  downloads?: number;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  amenities?: string[];
  schedule?: string;
  availability?: string;
  university?: string;
  subject?: string;
  level?: string;
  eventDate?: string;
  seatsAvailable?: number;
  totalSeats?: number;
}

interface ServiceCardProps {
  service: Service;
  className?: string;
}

const CATEGORY_ICONS = {
  notes: '📄',
  hostels: '🏠',
  tutors: '👨‍🏫',
  events: '🎉',
  cafes: '☕',
  transport: '🚌',
  fitness: '🏋️',
  food: '🍕',
  books: '📚',
  services: '🔧',
  accommodation: '🏠',
  entertainment: '🎉',
  shopping: '🛍️',
};

const getCategoryIcon = (category: string) => {
  return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '🏪';
};

const formatPrice = (price?: number, priceRange?: string) => {
  if (price === 0) return 'Free';
  if (price) return `₹${price}`;
  if (priceRange === 'free') return 'Free';
  if (priceRange === '1-500') return '₹1-500';
  if (priceRange === '500-2000') return '₹500-2000';
  if (priceRange === '2000+') return '₹2000+';
  return '';
};

const NotesCard = ({ service }: { service: Service }) => (
  <>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📄</span>
            <Badge variant="secondary" className="text-xs">Notes</Badge>
            {service.isVerified && (
              <Badge className="bg-blue-100 text-blue-800 text-xs">✓ Verified</Badge>
            )}
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <Save className="w-4 h-4" />
            </Button>
          </div>
          
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {service.name}
          </h3>
          
          <div className="text-sm text-muted-foreground">
            By {service.author} • {service.subject} • {service.university} • {service.schedule}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <RatingStars rating={parseFloat(service.averageRating)} size="sm" />
            <span>({service.totalRatings} reviews)</span>
            <span className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{service.views?.toLocaleString()} views</span>
            </span>
            <span className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>{service.downloads?.toLocaleString()} downloads</span>
            </span>
          </div>
        </div>
        
        <div className="text-right">
          {service.price === 0 ? (
            <Badge className="bg-green-100 text-green-800">🆓 Free</Badge>
          ) : (
            <Badge className="bg-orange-100 text-orange-800">₹{service.price}</Badge>
          )}
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {service.description && (
        <p className="text-sm line-clamp-2">
          📝 {service.description}
        </p>
      )}
      
      {service.tags && (
        <div className="flex flex-wrap gap-1">
          {service.tags.slice(0, 5).map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex space-x-2 pt-2">
        <Button size="sm" variant="outline" className="flex-1">👁️ Preview</Button>
        <Button size="sm" variant="outline" className="flex-1">📥 Download</Button>
        <Button size="sm" className="flex-1">💬 Message Author</Button>
        <Button size="sm" variant="ghost" className="p-2">
          <Share className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </>
);

const HostelCard = ({ service }: { service: Service }) => (
  <>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏠</span>
            <Badge variant="secondary" className="text-xs">Hostel</Badge>
            {service.isVerified && (
              <Badge className="bg-blue-100 text-blue-800 text-xs">✓ Verified</Badge>
            )}
            <Badge className="bg-green-100 text-green-800 text-xs">📞 Call Now</Badge>
          </div>
          
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {service.name}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{service.address}</span>
            </span>
            <RatingStars rating={parseFloat(service.averageRating)} size="sm" />
            <span className="text-muted-foreground">({service.totalRatings} reviews)</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">₹{service.price}/month</span>
            {service.amenities && service.amenities.slice(0, 3).map((amenity, i) => (
              <span key={i}>• {amenity}</span>
            ))}
          </div>
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {service.description && (
        <p className="text-sm line-clamp-2">
          🏠 {service.description}
        </p>
      )}
      
      {service.tags && (
        <div className="flex flex-wrap gap-1">
          {service.tags.slice(0, 5).map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex space-x-2 pt-2">
        <Button size="sm" variant="outline" className="flex-1">📷 Photos</Button>
        <Button size="sm" variant="outline" className="flex-1">📅 Book Visit</Button>
        <Button size="sm" className="flex-1">💬 Chat Owner</Button>
        <Button size="sm" variant="ghost" className="p-2">
          <MapPin className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </>
);

const TutorCard = ({ service }: { service: Service }) => (
  <>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg">👨‍🏫</span>
            <Badge variant="secondary" className="text-xs">Tutor</Badge>
            <Badge className="bg-green-100 text-green-800 text-xs">🟢 Available</Badge>
          </div>
          
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {service.name}
          </h3>
          
          <div className="text-sm text-muted-foreground">
            {service.university} Graduate • 8+ years experience
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <RatingStars rating={parseFloat(service.averageRating)} size="sm" />
            <span>({service.totalRatings} reviews)</span>
            <span className="font-semibold text-primary">₹{service.price}/hr</span>
          </div>
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {service.description && (
        <p className="text-sm line-clamp-2">
          🎯 {service.description}
        </p>
      )}
      
      {service.tags && (
        <div className="flex flex-wrap gap-1">
          {service.tags.slice(0, 5).map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex space-x-2 pt-2">
        <Button size="sm" variant="outline" className="flex-1">👁️ Profile</Button>
        <Button size="sm" variant="outline" className="flex-1">📅 Book Session</Button>
        <Button size="sm" className="flex-1">💬 Message</Button>
        <Button size="sm" variant="ghost" className="p-2">
          <Star className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </>
);

const EventCard = ({ service }: { service: Service }) => (
  <>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎉</span>
            <Badge variant="secondary" className="text-xs">Event</Badge>
            {service.price === 0 && (
              <Badge className="bg-green-100 text-green-800 text-xs">🆓 Free Entry</Badge>
            )}
          </div>
          
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {service.name}
          </h3>
          
          <div className="text-sm text-muted-foreground">
            {service.eventDate} • {service.address} • 
            <span className="flex items-center space-x-1 inline-flex ml-1">
              <Users className="w-4 h-4" />
              <span>{service.seatsAvailable}/{service.totalSeats} seats left</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <RatingStars rating={parseFloat(service.averageRating)} size="sm" />
            <span>({service.totalRatings} reviews)</span>
          </div>
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {service.description && (
        <p className="text-sm line-clamp-2">
          🤖 {service.description}
        </p>
      )}
      
      {service.tags && (
        <div className="flex flex-wrap gap-1">
          {service.tags.slice(0, 5).map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex space-x-2 pt-2">
        <Button size="sm" className="flex-1">🎯 Register Now</Button>
        <Button size="sm" variant="outline" className="flex-1">📍 Location</Button>
        <Button size="sm" variant="outline" className="flex-1">📋 Agenda</Button>
        <Button size="sm" variant="ghost" className="p-2">
          <Share className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </>
);

const CafeCard = ({ service }: { service: Service }) => (
  <>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg">☕</span>
            <Badge variant="secondary" className="text-xs">Cafe</Badge>
            <Badge className="bg-green-100 text-green-800 text-xs">🟢 Open Now</Badge>
          </div>
          
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {service.name}
          </h3>
          
          <div className="text-sm text-muted-foreground">
            {service.address}
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <RatingStars rating={parseFloat(service.averageRating)} size="sm" />
            <span>({service.totalRatings} reviews)</span>
            <span>{formatPrice(service.price, service.priceRange)} per item</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {service.amenities && service.amenities.slice(0, 4).join(' • ')}
          </div>
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {service.description && (
        <p className="text-sm line-clamp-2">
          ☕ {service.description}
        </p>
      )}
      
      {service.schedule && (
        <div className="text-sm text-muted-foreground flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{service.schedule}</span>
        </div>
      )}
      
      {service.tags && (
        <div className="flex flex-wrap gap-1">
          {service.tags.slice(0, 5).map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex space-x-2 pt-2">
        <Button size="sm" variant="outline" className="flex-1">🗺️ Directions</Button>
        <Button size="sm" variant="outline" className="flex-1">📞 Call</Button>
        <Button size="sm" variant="outline" className="flex-1">📋 Menu</Button>
        <Button size="sm" variant="ghost" className="p-2">📷</Button>
      </div>
    </CardContent>
  </>
);

const DefaultCard = ({ service }: { service: Service }) => (
  <>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getCategoryIcon(service.category)}</span>
            <Badge variant="secondary" className="text-xs">
              {service.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
            {service.isVerified && (
              <Badge className="bg-blue-100 text-blue-800 text-xs">✓ Verified</Badge>
            )}
          </div>
          
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {service.name}
          </h3>
          
          {service.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {service.description}
            </p>
          )}
        </div>
        
        {(service.price !== undefined || service.priceRange) && (
          <Badge className="bg-primary/10 text-primary text-xs">
            {formatPrice(service.price, service.priceRange)}
          </Badge>
        )}
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {service.address && (
        <div className="flex items-start space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span className="text-muted-foreground line-clamp-2">{service.address}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <RatingStars rating={parseFloat(service.averageRating)} size="sm" />
        <span className="text-xs text-muted-foreground">({service.totalRatings} reviews)</span>
      </div>

      <div className="flex space-x-2 pt-2">
        <Button size="sm" variant="outline" className="flex-1">Contact</Button>
        <Button size="sm" className="flex-1">View Details</Button>
      </div>
    </CardContent>
  </>
);

export default function ServiceCard({ service, className }: ServiceCardProps) {
  const renderCardContent = () => {
    switch (service.category) {
      case 'notes':
        return <NotesCard service={service} />;
      case 'hostels':
      case 'accommodation':
        return <HostelCard service={service} />;
      case 'tutors':
      case 'tutoring':
        return <TutorCard service={service} />;
      case 'events':
      case 'entertainment':
        return <EventCard service={service} />;
      case 'cafes':
        return <CafeCard service={service} />;
      default:
        return <DefaultCard service={service} />;
    }
  };

  return (
    <Card className={cn("hover-lift transition-all duration-300", className)} data-testid={`service-card-${service.id}`}>
      {renderCardContent()}
    </Card>
  );
}