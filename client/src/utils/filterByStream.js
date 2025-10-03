export const filterByStream = (items, stream) => {
  if (!stream || !items || !Array.isArray(items)) {
    return items || [];
  }
  
  return items.filter(item => {
    if (!item.stream && !item.streams) return true;
    
    if (item.stream) {
      return item.stream.toLowerCase() === stream.toLowerCase();
    }
    
    if (item.streams && Array.isArray(item.streams)) {
      return item.streams.some(s => s.toLowerCase() === stream.toLowerCase());
    }
    
    return true;
  });
};

export const filterByYear = (items, year) => {
  if (!year || !items || !Array.isArray(items)) {
    return items || [];
  }
  
  return items.filter(item => {
    if (!item.year && !item.years) return true;
    
    if (item.year) {
      return item.year.toString() === year.toString();
    }
    
    if (item.years && Array.isArray(item.years)) {
      return item.years.some(y => y.toString() === year.toString());
    }
    
    return true;
  });
};

export const filterBySubjects = (items, subjects) => {
  if (!subjects || !Array.isArray(subjects) || subjects.length === 0 || !items || !Array.isArray(items)) {
    return items || [];
  }
  
  return items.filter(item => {
    if (!item.subject && !item.subjects) return true;
    
    if (item.subject) {
      return subjects.some(s => s.toLowerCase() === item.subject.toLowerCase());
    }
    
    if (item.subjects && Array.isArray(item.subjects)) {
      return subjects.some(s => 
        item.subjects.some(itemSubject => 
          itemSubject.toLowerCase() === s.toLowerCase()
        )
      );
    }
    
    return true;
  });
};

export const filterByUniversity = (items, university) => {
  if (!university || !items || !Array.isArray(items)) {
    return items || [];
  }
  
  return items.filter(item => {
    if (!item.university) return true;
    return item.university.toLowerCase() === university.toLowerCase();
  });
};

export const applyAllFilters = (items, filters) => {
  if (!filters || !items || !Array.isArray(items)) {
    return items || [];
  }
  
  let filtered = items;
  
  if (filters.stream) {
    filtered = filterByStream(filtered, filters.stream);
  }
  
  if (filters.year) {
    filtered = filterByYear(filtered, filters.year);
  }
  
  if (filters.subjects && filters.subjects.length > 0) {
    filtered = filterBySubjects(filtered, filters.subjects);
  }
  
  if (filters.university) {
    filtered = filterByUniversity(filtered, filters.university);
  }
  
  return filtered;
};
