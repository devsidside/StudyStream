export const getNotificationIcon = (type) => {
  const iconMap = {
    event_reminder: '📅',
    new_note: '📝',
    new_project: '💼',
    vendor_message: '💬',
    system_alert: '⚠️',
    booking_confirmation: '✅',
    review_request: '⭐',
    deadline_reminder: '⏰'
  };
  
  return iconMap[type] || '🔔';
};

export const getNotificationColor = (type) => {
  const colorMap = {
    event_reminder: 'blue',
    new_note: 'green',
    new_project: 'purple',
    vendor_message: 'orange',
    system_alert: 'red',
    booking_confirmation: 'green',
    review_request: 'yellow',
    deadline_reminder: 'red'
  };
  
  return colorMap[type] || 'gray';
};

export const formatNotificationMessage = (notification) => {
  if (!notification) return '';
  
  const { type, title, message, metadata } = notification;
  
  if (message) return message;
  
  const messageMap = {
    event_reminder: `Reminder: ${metadata?.eventName || 'Event'} is coming up soon`,
    new_note: `New note available: ${metadata?.noteTitle || 'Untitled'}`,
    new_project: `New project shared: ${metadata?.projectName || 'Untitled'}`,
    vendor_message: `Message from ${metadata?.vendorName || 'vendor'}`,
    system_alert: metadata?.message || 'System notification',
    booking_confirmation: `Booking confirmed for ${metadata?.serviceName || 'service'}`,
    review_request: `Please review your experience with ${metadata?.vendorName || 'vendor'}`,
    deadline_reminder: `Deadline approaching: ${metadata?.taskName || 'task'}`
  };
  
  return messageMap[type] || title || 'New notification';
};

export const groupNotificationsByDate = (notifications) => {
  if (!notifications || !Array.isArray(notifications)) {
    return {};
  }
  
  const grouped = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: []
  };
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  notifications.forEach(notification => {
    const notifDate = new Date(notification.created_at || notification.timestamp);
    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());
    
    if (notifDay.getTime() === today.getTime()) {
      grouped.today.push(notification);
    } else if (notifDay.getTime() === yesterday.getTime()) {
      grouped.yesterday.push(notification);
    } else if (notifDay >= lastWeek) {
      grouped.thisWeek.push(notification);
    } else {
      grouped.older.push(notification);
    }
  });
  
  return grouped;
};

export const getUnreadCount = (notifications) => {
  if (!notifications || !Array.isArray(notifications)) {
    return 0;
  }
  
  return notifications.filter(n => !n.read && !n.is_read).length;
};

export const markAsRead = async (notificationId, updateFunction) => {
  if (!notificationId || !updateFunction) {
    return { error: 'Invalid parameters' };
  }
  
  try {
    await updateFunction(notificationId, { read: true });
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { error };
  }
};

export const markAllAsRead = async (notifications, updateFunction) => {
  if (!notifications || !Array.isArray(notifications) || !updateFunction) {
    return { error: 'Invalid parameters' };
  }
  
  const unreadIds = notifications
    .filter(n => !n.read && !n.is_read)
    .map(n => n.id);
  
  try {
    await Promise.all(unreadIds.map(id => updateFunction(id, { read: true })));
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { error };
  }
};
