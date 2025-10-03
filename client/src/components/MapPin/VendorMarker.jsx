import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VendorMarker({ vendor, onClick, isSelected = false }) {
  if (!vendor) return null;

  const getCategoryColor = (category) => {
    const colors = {
      accommodation: 'text-blue-500',
      tutoring: 'text-green-500',
      food: 'text-orange-500',
      stationery: 'text-purple-500',
      default: 'text-gray-500'
    };
    return colors[category] || colors.default;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      accommodation: '🏠',
      tutoring: '📚',
      food: '🍽️',
      stationery: '✏️',
      default: '📍'
    };
    return icons[category] || icons.default;
  };

  return (
    <div 
      className="relative inline-block cursor-pointer" 
      onClick={() => onClick?.(vendor)}
      data-testid={`marker-vendor-${vendor.id}`}
    >
      <MapPin 
        className={`h-8 w-8 ${getCategoryColor(vendor.category)} ${isSelected ? 'animate-bounce' : ''}`}
        fill="currentColor"
      />
      
      {isSelected && vendor.business_name && (
        <Card className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 p-4 shadow-lg z-50 bg-white dark:bg-gray-800" data-testid={`card-vendor-popup-${vendor.id}`}>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span data-testid={`icon-vendor-category-${vendor.id}`}>{getCategoryIcon(vendor.category)}</span>
                  <h3 className="font-semibold text-sm text-black dark:text-white" data-testid={`text-vendor-name-${vendor.id}`}>
                    {vendor.business_name}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1" data-testid={`text-vendor-category-${vendor.id}`}>
                  {vendor.category}
                </p>
              </div>
            </div>

            {vendor.description && (
              <p className="text-xs text-gray-700 dark:text-gray-300" data-testid={`text-vendor-description-${vendor.id}`}>
                {vendor.description}
              </p>
            )}

            {vendor.address && (
              <p className="text-xs text-gray-600 dark:text-gray-400" data-testid={`text-vendor-address-${vendor.id}`}>
                📍 {vendor.address}
              </p>
            )}

            {vendor.rating && (
              <div className="flex items-center gap-1" data-testid={`rating-vendor-${vendor.id}`}>
                <span className="text-yellow-500">⭐</span>
                <span className="text-xs font-semibold text-black dark:text-white" data-testid={`text-vendor-rating-${vendor.id}`}>
                  {vendor.rating}
                </span>
                {vendor.review_count && (
                  <span className="text-xs text-gray-500 dark:text-gray-400" data-testid={`text-vendor-reviews-${vendor.id}`}>
                    ({vendor.review_count} reviews)
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <Button size="sm" className="flex-1" data-testid={`button-view-vendor-${vendor.id}`}>
                View Details
              </Button>
              {vendor.contact && (
                <Button size="sm" variant="outline" data-testid={`button-contact-vendor-${vendor.id}`}>
                  Contact
                </Button>
              )}
            </div>
          </div>

          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white dark:border-t-gray-800" />
        </Card>
      )}
    </div>
  );
}
