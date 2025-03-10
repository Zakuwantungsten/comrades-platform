import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationsList = ({ notifications = [], onRead }) => {


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem
              onRead={onRead} 

              key={notification._id} 
              notification={notification} 
            />
          ))
        ) : (
          <div className="p-4 text-gray-500">No new notifications</div>
        )}
      </div>
    </div>
  );
};

export default NotificationsList;
