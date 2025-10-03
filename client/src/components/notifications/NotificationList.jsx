import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Check, Trash2 } from 'lucide-react';
import {
  getNotificationIcon,
  formatNotificationMessage,
  groupNotificationsByDate
} from '@/utils/notificationHelper';
import { formatRelativeTime } from '@/utils/formatDate';

export default function NotificationList({
  notifications = [],
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}) {
  const groupedNotifications = groupNotificationsByDate(notifications);
  const hasUnread = notifications.some(n => !n.read && !n.is_read);

  const renderNotificationGroup = (title, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div key={title} className="mb-4" data-testid={`group-${title.toLowerCase()}`}>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2" data-testid={`text-group-title-${title.toLowerCase()}`}>
          {title}
        </h4>
        <div className="space-y-2">
          {items.map((notification) => {
            const isUnread = !notification.read && !notification.is_read;
            
            return (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-colors ${
                  isUnread
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
                data-testid={`notification-${notification.id}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl" data-testid={`icon-notification-${notification.id}`}>
                    {getNotificationIcon(notification.type)}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    {notification.title && (
                      <h5 className="font-semibold text-sm text-black dark:text-white mb-1" data-testid={`text-notification-title-${notification.id}`}>
                        {notification.title}
                      </h5>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300" data-testid={`text-notification-message-${notification.id}`}>
                      {formatNotificationMessage(notification)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" data-testid={`text-notification-time-${notification.id}`}>
                      {formatRelativeTime(notification.created_at || notification.timestamp)}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    {isUnread && onMarkAsRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                        data-testid={`button-mark-read-${notification.id}`}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(notification.id)}
                        data-testid={`button-delete-${notification.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="absolute right-0 top-12 w-96 max-h-[500px] shadow-lg z-50 bg-white dark:bg-gray-800" data-testid="card-notification-list">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-black dark:text-white" data-testid="text-notifications-header">Notifications</h3>
        <div className="flex gap-2">
          {hasUnread && onMarkAllAsRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              data-testid="button-mark-all-read"
            >
              Mark all read
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-notifications"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[400px]" data-testid="scroll-notifications">
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="text-no-notifications">
              <p>No notifications</p>
            </div>
          ) : (
            <>
              {renderNotificationGroup('Today', groupedNotifications.today)}
              {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
              {renderNotificationGroup('This Week', groupedNotifications.thisWeek)}
              {renderNotificationGroup('Older', groupedNotifications.older)}
            </>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
