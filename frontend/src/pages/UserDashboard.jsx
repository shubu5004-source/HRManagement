import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import "./UserNotifications.css";

function UserDashboard() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get("/user/notifications")
      .then(res => setNotifications(res.data));
  }, []);

   return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map(n => (
          <div key={n.id} className="notification-card">
            <div className="notification-title">{n.title}</div>
            <div className="notification-message">{n.message}</div>
            <div className="notification-date">
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UserDashboard;
