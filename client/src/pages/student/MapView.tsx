import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  GraduationCap,
  Building,
  PartyPopper,
  Coffee,
  Bus,
  Search,
  Plus,
  Minus,
  Navigation,
  Maximize,
  List,
  Filter,
  Menu,
  Bell,
  Star,
  Clock
} from "lucide-react";
import MapViewComponent from "@/components/MapPin/MapView";

export default function MapView() {
  const [searchRadius, setSearchRadius] = useState("1");
  const [mapView, setMapView] = useState("street");
  const [selectedService, setSelectedService] = useState<any>(null);

  const mapLayers = [
    { id: "libraries", label: "Libraries", icon: BookOpen, checked: true },
    { id: "tutors", label: "Tutors", icon: GraduationCap, checked: true },
    { id: "hostels", label: "Hostels", icon: Building, checked: false },
    { id: "events", label: "Events", icon: PartyPopper, checked: false },
    { id: "cafes", label: "Cafes", icon: Coffee, checked: false },
    { id: "transport", label: "Transport", icon: Bus, checked: false },
  ];

  const mapServices = [
    {
      id: 1,
      name: "Central Library",
      type: "library",
      position: { x: 45, y: 35 },
      rating: 4.8,
      distance: "0.3 mi",
      status: "Open until 10 PM",
      icon: "📚"
    },
    {
      id: 2,
      name: "Science Library",
      type: "library", 
      position: { x: 65, y: 25 },
      rating: 4.6,
      distance: "0.8 mi",
      status: "Closed",
      icon: "📚"
    },
    {
      id: 3,
      name: "Math Tutor",
      type: "tutor",
      position: { x: 35, y: 55 },
      rating: 4.9,
      distance: "0.5 mi",
      status: "Available",
      icon: "👨‍🏫"
    },
    {
      id: 4,
      name: "Green Hostel",
      type: "hostel",
      position: { x: 75, y: 45 },
      rating: 4.5,
      distance: "0.8 mi",
      status: "Rooms Available",
      icon: "🏠"
    },
    {
      id: 5,
      name: "Campus Cafe",
      type: "cafe",
      position: { x: 40, y: 65 },
      rating: 4.3,
      distance: "0.4 mi",
      status: "Open",
      icon: "☕"
    },
    {
      id: 6,
      name: "Tech Workshop",
      type: "event",
      position: { x: 60, y: 70 },
      rating: 4.7,
      distance: "0.6 mi",
      status: "Today 3 PM",
      icon: "🎉"
    },
    {
      id: 7,
      name: "East Library",
      type: "library",
      position: { x: 55, y: 85 },
      rating: 4.4,
      distance: "1.2 mi",
      status: "Open until 11 PM",
      icon: "📚"
    }
  ];

  const visibleServices = mapServices.filter(service => {
    const layerEnabled = mapLayers.find(layer => 
      layer.id === service.type + 's' || 
      (service.type === 'library' && layer.id === 'libraries') ||
      (service.type === 'tutor' && layer.id === 'tutors') ||
      (service.type === 'hostel' && layer.id === 'hostels') ||
      (service.type === 'event' && layer.id === 'events') ||
      (service.type === 'cafe' && layer.id === 'cafes')
    );
    return layerEnabled?.checked;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8" data-testid="heading-map-view">Campus Map View</h1>
          <div className="flex gap-8">
            {/* Map Controls Sidebar */}
            <aside className="w-64 bg-background border border-border rounded-lg p-4 overflow-y-auto h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {/* Map Layers */}
            <div>
              <h3 className="font-semibold text-foreground mb-3" data-testid="heading-layers">Layers:</h3>
              <div className="space-y-2">
                {mapLayers.map((layer) => (
                  <div key={layer.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={layer.id}
                      checked={layer.checked}
                      onCheckedChange={(checked) => {
                        // In a real app, you'd update the layer state here
                        console.log(`Toggle ${layer.id}: ${checked}`);
                      }}
                      data-testid={`checkbox-layer-${layer.id}`}
                    />
                    <layer.icon className="h-4 w-4 text-muted-foreground" />
                    <label htmlFor={layer.id} className="text-sm text-foreground">
                      {layer.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Map View */}
            <div>
              <h3 className="font-semibold text-foreground mb-3" data-testid="heading-view">View:</h3>
              <RadioGroup value={mapView} onValueChange={setMapView}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="street" id="street" />
                  <Label htmlFor="street" className="text-sm">Street</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="satellite" id="satellite" />
                  <Label htmlFor="satellite" className="text-sm">Satellite</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Search Radius */}
            <div>
              <h3 className="font-semibold text-foreground mb-3" data-testid="heading-search">Search:</h3>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Search radius</Label>
                <RadioGroup value={searchRadius} onValueChange={setSearchRadius}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="radius-1" />
                    <Label htmlFor="radius-1" className="text-sm">📍 1 mile radius</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="radius-3" />
                    <Label htmlFor="radius-3" className="text-sm">📍 3 mile radius</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="radius-5" />
                    <Label htmlFor="radius-5" className="text-sm">📍 5 mile radius</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
              </div>
            </aside>

            {/* Map Area */}
            <main className="flex-1 relative">
          <div className="h-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 relative overflow-hidden">
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
              <Button variant="outline" size="sm" data-testid="button-zoom-in">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" data-testid="button-zoom-out">
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" data-testid="button-locate">
                <Navigation className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" data-testid="button-fullscreen">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            {/* User Location */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: '50%', top: '50%' }}
            >
              <div className="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-black text-white px-2 py-1 rounded whitespace-nowrap">
                📍 You are here
              </div>
            </div>

            {/* Service Markers */}
            {visibleServices.map((service) => (
              <div
                key={service.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{ 
                  left: `${service.position.x}%`, 
                  top: `${service.position.y}%` 
                }}
                onClick={() => setSelectedService(service)}
                data-testid={`marker-${service.id}`}
              >
                <div className="text-2xl hover:scale-110 transition-transform">
                  {service.icon}
                </div>
              </div>
            ))}

            {/* Service Details Popup */}
            {selectedService && (
              <div 
                className="absolute z-30 bg-background border border-border rounded-lg shadow-lg p-4 w-64"
                style={{ 
                  left: `${Math.min(selectedService.position.x, 80)}%`, 
                  top: `${Math.max(selectedService.position.y - 10, 10)}%` 
                }}
                data-testid="service-popup"
              >
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground" data-testid="popup-service-name">
                    {selectedService.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm" data-testid="popup-service-rating">
                      {selectedService.rating}
                    </span>
                    <span className="text-sm text-muted-foreground" data-testid="popup-service-distance">
                      📍 {selectedService.distance}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid="popup-service-status">
                    ✅ {selectedService.status}
                  </p>
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" data-testid="popup-view-details">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" data-testid="popup-directions">
                      Directions
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0"
                  onClick={() => setSelectedService(null)}
                  data-testid="popup-close"
                >
                  ×
                </Button>
              </div>
            )}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3">
              <div className="text-xs space-y-1">
                <div className="flex items-center space-x-2">
                  <span>📚</span>
                  <span>Libraries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>👨‍🏫</span>
                  <span>Tutors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🏠</span>
                  <span>Hostels</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>☕</span>
                  <span>Cafes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🎉</span>
                  <span>Events</span>
                </div>
              </div>
            </div>
              </div>

              <MapViewComponent 
                vendors={visibleServices}
                onVendorClick={(vendor) => setSelectedService(vendor)}
              />
            </main>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}