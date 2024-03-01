import React, { useState, useEffect } from "react";
import "./error.css"; // Import CSS file for styling

function Notification({ message }) {
  const [isVisible, setIsVisible] = useState(true);

  // Hide the notification after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // Cleanup function to clear the timeout when the component unmounts or isVisible changes
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={`notification ${isVisible ? "visible" : "hidden"}`}>
      <p className="notif-text">{message}</p>
    </div>
  );
}

export default Notification;
