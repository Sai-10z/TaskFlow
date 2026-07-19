import { useEffect, useRef } from "react";
import API from "../api/axios";

export default function useNotifications() {
  const notifiedTasks = useRef(new Set());

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const checkTasks = async () => {
      if (Notification.permission !== "granted") return;

      try {
        const { data: tasks } = await API.get("/tasks");
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        tasks.forEach((task) => {
          if (task.completed || !task.deadline) return;

          const deadlineDate = new Date(task.deadline);
          
          if (deadlineDate > now && deadlineDate <= oneHourFromNow) {
            if (!notifiedTasks.current.has(task.id)) {
              new Notification("Task Due Soon", {
                body: `"${task.title}" is due at ${deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
              });
              notifiedTasks.current.add(task.id);
            }
          }
        });
      } catch (error) {
        console.error("Failed to fetch tasks for notifications", error);
      }
    };

    // Check immediately, then every 5 minutes
    checkTasks();
    const interval = setInterval(checkTasks, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}
