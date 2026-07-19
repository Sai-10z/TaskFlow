import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import "../styles/calendar.css";

function CalendarView() {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  const getLocalYMD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (dateStr, dateObj, tasksForDay) => {
    setSelectedDate({ dateStr, dateObj, tasksForDay });
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to fetch tasks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Group tasks by date string (YYYY-MM-DD)
  const tasksByDate = useMemo(() => {
    const grouped = {};
    tasks.forEach((task) => {
      if (!task.deadline) return;
      const dateStr = getLocalYMD(new Date(task.deadline));
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(task);
    });
    return grouped;
  }, [tasks]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays = [];
  // Padding for previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i);
    calendarDays.push(date);
  }

  const getPriorityColor = (tasksForDay) => {
    if (!tasksForDay || tasksForDay.length === 0) return null;
    if (tasksForDay.some((t) => t.priority?.toUpperCase() === "HIGH")) return "var(--danger)";
    if (tasksForDay.some((t) => t.priority?.toUpperCase() === "MEDIUM")) return "var(--warning)";
    return "var(--success)";
  };

  return (
    <div className="calendar-container">
      <motion.section
        className="calendar-header glass-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>
            Calendar <CalendarIcon size={24} className="header-icon" />
          </h1>
          <p>Track your deadlines and manage task fatigue visually.</p>
        </div>
        <div className="calendar-controls">
          <button onClick={prevMonth} className="btn-icon">
            <ChevronLeft />
          </button>
          <h2>{monthNames[currentMonth]} {currentYear}</h2>
          <button onClick={nextMonth} className="btn-icon">
            <ChevronRight />
          </button>
        </div>
      </motion.section>

      {isLoading ? (
        <div className="calendar-loader">Loading your schedule...</div>
      ) : (
        <motion.div
          className="calendar-grid-wrapper glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="calendar-day-names">
            {dayNames.map((day) => (
              <div key={day} className="day-name">{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="calendar-cell empty"></div>;
              }

              const dateStr = getLocalYMD(date);
              const tasksForDay = tasksByDate[dateStr] || [];
              const priorityColor = getPriorityColor(tasksForDay);
              
              const isToday = getLocalYMD(new Date()) === dateStr;

              return (
                <div 
                  key={dateStr} 
                  onClick={() => handleDateClick(dateStr, date, tasksForDay)}
                  className={`calendar-cell ${isToday ? "today" : ""} ${tasksForDay.length > 0 ? "has-tasks" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="date-number" style={{ borderColor: priorityColor || "transparent" }}>
                    {date.getDate()}
                  </div>
                  
                  {isToday && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '-4px' }}>Today</span>
                  )}

                  {tasksForDay.length > 0 && (
                    <div className="cell-tasks-indicator">
                      {tasksForDay.length} task{tasksForDay.length > 1 ? 's' : ''}
                    </div>
                  )}


                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Priority Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '1rem', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--danger)' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>High Priority</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--warning)' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Medium Priority</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Low Priority</span>
        </div>
      </div>
      
      {/* Selected Date Modal */}
      {createPortal(
        <AnimatePresence>
        {selectedDate && (
          <motion.div
            className="panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDate(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <motion.div
              className="modal-panel"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "500px",
                maxHeight: "80vh",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "24px",
                boxShadow: "var(--shadow-lg)",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  padding: "24px",
                  borderBottom: "1px solid var(--border-color)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "var(--bg-card)",
                  zIndex: 10,
                }}
              >
                <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                  Deadlines for {selectedDate.dateObj.toDateString()}
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  style={{ background: "transparent", color: "var(--text-muted)", cursor: "pointer", border: "none" }}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {selectedDate.tasksForDay.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    <p style={{ fontSize: "1.1rem" }}>No tasks deadline today! 🎉</p>
                  </div>
                ) : (
                  selectedDate.tasksForDay.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        padding: "16px",
                        background: "var(--bg-secondary)",
                        borderRadius: "12px",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background:
                            task.priority?.toUpperCase() === "HIGH"
                              ? "var(--danger)"
                              : task.priority?.toUpperCase() === "MEDIUM"
                              ? "var(--warning)"
                              : "var(--success)",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: "500" }}>
                        {task.title}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </div>
  );
}

export default CalendarView;
