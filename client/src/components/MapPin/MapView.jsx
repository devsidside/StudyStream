import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Filter } from 'lucide-react';
import VendorMarker from './VendorMarker';
import { calculateDistance, formatDistance } from '@/utils/calculateDistance';

export default function MapView({ vendors = [], events = [], onVendorClick, onEventClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    let items = [...vendors, ...events];

    if (searchQuery) {
      items = items.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    if (userLocation) {
      items = items.map(item => ({
        ...item,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          item.latitude || item.lat,
          item.longitude || item.lng
        )
      })).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    setFilteredItems(items);
  }, [vendors, events, searchQuery, selectedCategory, userLocation]);

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900" data-testid="container-map-view">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors, events..."
              className="pl-10"
              data-testid="input-search-map"
            />
          </div>
          <Button variant="outline" data-testid="button-filter-map">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            data-testid="button-category-all"
          >
            All
          </Button>
          <Button
            variant={selectedCategory === 'accommodation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('accommodation')}
            data-testid="button-category-accommodation"
          >
            Accommodation
          </Button>
          <Button
            variant={selectedCategory === 'tutoring' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('tutoring')}
            data-testid="button-category-tutoring"
          >
            Tutoring
          </Button>
          <Button
            variant={selectedCategory === 'food' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('food')}
            data-testid="button-category-food"
          >
            Food
          </Button>
          <Button
            variant={selectedCategory === 'event' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('event')}
            data-testid="button-category-event"
          >
            Events
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100%-150px)]">
        <div className="border-r border-gray-200 dark:border-gray-700 overflow-y-auto" data-testid="list-map-items">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400" data-testid="text-no-results">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No items found</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredItems.map((item, index) => (
                <Card
                  key={item.id || index}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                  onClick={() => {
                    if (item.business_name) {
                      onVendorClick?.(item);
                    } else {
                      onEventClick?.(item);
                    }
                  }}
                  data-testid={`card-map-item-${item.id || index}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-black dark:text-white" data-testid={`text-item-name-${item.id || index}`}>
                        {item.name || item.title || item.business_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1" data-testid={`text-item-description-${item.id || index}`}>
                        {item.description || item.category}
                      </p>
                      {item.distance !== null && item.distance !== undefined && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2" data-testid={`text-item-distance-${item.id || index}`}>
                          📍 {formatDistance(item.distance)} away
                        </p>
                      )}
                    </div>
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-8 flex items-center justify-center" data-testid="container-map-placeholder">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold" data-testid="text-map-placeholder">Interactive Map</p>
            <p className="text-sm mt-2" data-testid="text-map-description">Map integration will be displayed here</p>
            <p className="text-xs mt-4" data-testid="text-map-note">Requires Google Maps or Mapbox API</p>
          </div>
        </div>
      </div>
    </div>
  );
}
