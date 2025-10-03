export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return null;
  }
  
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

export const formatDistance = (distance) => {
  if (distance === null || distance === undefined) {
    return '';
  }
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  
  return `${distance.toFixed(1)} km`;
};

export const sortByDistance = (items, userLat, userLon) => {
  if (!userLat || !userLon || !items || !Array.isArray(items)) {
    return items || [];
  }
  
  return items
    .map(item => {
      const distance = calculateDistance(
        userLat, 
        userLon, 
        item.latitude || item.lat, 
        item.longitude || item.lon || item.lng
      );
      
      return {
        ...item,
        distance
      };
    })
    .sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
};

export const filterByRadius = (items, userLat, userLon, radiusKm) => {
  if (!userLat || !userLon || !radiusKm || !items || !Array.isArray(items)) {
    return items || [];
  }
  
  return items.filter(item => {
    const distance = calculateDistance(
      userLat, 
      userLon, 
      item.latitude || item.lat, 
      item.longitude || item.lon || item.lng
    );
    
    return distance !== null && distance <= radiusKm;
  });
};
