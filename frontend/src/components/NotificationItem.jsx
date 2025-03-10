import React from 'react';

import { markNotificationAsRead } from '../api/notifications';

const NotificationItem = ({ notification, onRead }) => {

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'request':
        return '📨';
      case 'accept':
        return '✅';
      case 'reject':
        return '❌';
      case 'message':
        return '💬';
      default:
        return '🔔';
    }
  };

  const handleClick = async () => {
    await markNotificationAsRead(notification._id);
    onRead(notification._id); // Call the onRead function to update the state in the parent component
  };

  return (
    <div className="flex items-start p-4 border-b border-gray-100 hover:bg-gray-50" onClick={handleClick}>

      <div className="text-xl mr-4">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1">
        <p className="text-gray-700">{notification.message}</p>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
