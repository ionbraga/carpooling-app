export function NotificationStack({ notifications, onDismiss }) {
  return (
    <div className="notification-stack" aria-live="polite" aria-atomic="true">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification--${notification.type}`}
        >
          <span>{notification.message}</span>
          <button type="button" onClick={() => onDismiss(notification.id)} aria-label="Inchide notificarea">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
