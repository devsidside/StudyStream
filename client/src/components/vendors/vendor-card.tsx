import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/common/rating-stars";
import { MapPin, Phone, Mail, ExternalLink, Star } from "lucide-react";
import { cn } from "@/utils/utils";

interface Vendor {
  id: number;
  name: string;
  description?: string;
  category: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  priceRange?: string;
  averageRating: string;
  totalRatings: number;
  isVerified: boolean;
}

interface VendorCardProps {
  vendor: Vendor;
  className?: string;
}

const CATEGORY_ICONS = {
  accommodation: '🏠',
  food: '🍽️',
  tutoring: '👨‍🏫',
  transport: '🚗',
  entertainment: '🎉',
  services: '🔧',
  shopping: '🛍️',
};

const PRICE_RANGE_LABELS = {
  budget: 'Budget-friendly',
  'mid-range': 'Mid-range',
  premium: 'Premium',
};

export default function VendorCard({ vendor, className }: VendorCardProps) {
  const formatCategory = (category: string) => {
    return category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '🏪';
  };

  const getPriceRangeColor = (range?: string) => {
    switch (range) {
      case 'budget':
        return 'bg-green-100 text-green-800';
      case 'mid-range':
        return 'bg-yellow-100 text-yellow-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={cn("hover-lift transition-all duration-300", className)} data-testid={`vendor-card-${vendor.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getCategoryIcon(vendor.category)}</span>
              <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${vendor.id}`}>
                {formatCategory(vendor.category)}
              </Badge>
              {vendor.isVerified && (
                <Badge className="bg-blue-100 text-blue-800 text-xs" data-testid={`badge-verified-${vendor.id}`}>
                  ✓ Verified
                </Badge>
              )}
            </div>
            
            <h3 className="font-semibold text-lg leading-tight line-clamp-1" data-testid={`text-vendor-name-${vendor.id}`}>
              {vendor.name}
            </h3>
            
            {vendor.description && (
              <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${vendor.id}`}>
                {vendor.description}
              </p>
            )}
          </div>
          
          {vendor.priceRange && (
            <Badge 
              className={cn("text-xs", getPriceRangeColor(vendor.priceRange))}
              data-testid={`badge-price-range-${vendor.id}`}
            >
              {PRICE_RANGE_LABELS[vendor.priceRange as keyof typeof PRICE_RANGE_LABELS]}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location */}
        {vendor.address && (
          <div className="flex items-start space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground line-clamp-2" data-testid={`text-address-${vendor.id}`}>
              {vendor.address}
            </span>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2">
          {vendor.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a 
                href={`tel:${vendor.phone}`} 
                className="text-primary hover:underline"
                data-testid={`link-phone-${vendor.id}`}
              >
                {vendor.phone}
              </a>
            </div>
          )}
          
          {vendor.email && (
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a 
                href={`mailto:${vendor.email}`} 
                className="text-primary hover:underline"
                data-testid={`link-email-${vendor.id}`}
              >
                {vendor.email}
              </a>
            </div>
          )}
          
          {vendor.website && (
            <div className="flex items-center space-x-2 text-sm">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              <a 
                href={vendor.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                data-testid={`link-website-${vendor.id}`}
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <RatingStars
            rating={parseFloat(vendor.averageRating)}
            size="sm"
            className="text-xs"
          />
          <span className="text-xs text-muted-foreground" data-testid={`text-rating-count-${vendor.id}`}>
            ({vendor.totalRatings} reviews)
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1" data-testid={`button-contact-${vendor.id}`}>
            Contact
          </Button>
          <Button size="sm" className="flex-1" data-testid={`button-view-details-${vendor.id}`}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
