const mapService = {
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  },

  formatDistance(distanceInMeters) {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)}m`;
    }
    return `${(distanceInMeters / 1000).toFixed(1)}km`;
  },

  async geocodeAddress(address) {
    throw new Error('Geocoding requires an external API service');
  },

  async reverseGeocode(latitude, longitude) {
    throw new Error('Reverse geocoding requires an external API service');
  },

  isWithinRadius(lat1, lon1, lat2, lon2, radiusInMeters) {
    const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
    return distance <= radiusInMeters;
  },

  sortByDistance(items, userLat, userLon, latKey = 'latitude', lonKey = 'longitude') {
    return items
      .map(item => ({
        ...item,
        distance: this.calculateDistance(
          userLat,
          userLon,
          item[latKey],
          item[lonKey]
        )
      }))
      .sort((a, b) => a.distance - b.distance);
  },

  filterByRadius(items, userLat, userLon, radiusInMeters, latKey = 'latitude', lonKey = 'longitude') {
    return items.filter(item =>
      this.isWithinRadius(
        userLat,
        userLon,
        item[latKey],
        item[lonKey],
        radiusInMeters
      )
    );
  },

  getBounds(items, latKey = 'latitude', lonKey = 'longitude') {
    if (items.length === 0) return null;

    const lats = items.map(item => item[latKey]);
    const lons = items.map(item => item[lonKey]);

    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lons),
      west: Math.min(...lons)
    };
  },

  getCenter(items, latKey = 'latitude', lonKey = 'longitude') {
    if (items.length === 0) return null;

    const lats = items.map(item => item[latKey]);
    const lons = items.map(item => item[lonKey]);

    return {
      latitude: lats.reduce((a, b) => a + b, 0) / lats.length,
      longitude: lons.reduce((a, b) => a + b, 0) / lons.length
    };
  }
};

export default mapService;
