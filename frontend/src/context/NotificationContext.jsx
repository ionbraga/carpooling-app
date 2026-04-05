import { createContext, useCallback, useMemo, useState } from 'react';
import { NotificationStack } from '../components/common/NotificationStack';

export const NotificationContext = createContext(null);

let notificationId = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback((message, type = 'info') => {
    const id = ++notificationId;

    setNotifications((current) => [...current, { id, message, type }]);

    window.setTimeout(() => {
      removeNotification(id);
    }, 3500);
  }, [removeNotification]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationStack notifications={notifications} onDismiss={removeNotification} />
    </NotificationContext.Provider>
  );
}
