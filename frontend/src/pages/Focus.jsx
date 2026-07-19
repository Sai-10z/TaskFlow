import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";
import "../styles/focus.css";

const MODES = {
  FOCUS: { label: "Focus", time: 25 * 60 },
  SHORT_BREAK: { label: "Short Break", time: 5 * 60 },
  LONG_BREAK: { label: "Long Break", time: 15 * 60 },
};

function Focus() {
  const { showToast } = useToast();
  
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  
  const [mode, setMode] = useState("FOCUS");
  const [timeLeft, setTimeLeft] = useState(MODES.FOCUS.time);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await API.get("/tasks");
        setTasks(data.filter(t => !t.completed));
      } catch (error) {
        console.error("Failed to load tasks", error);
      }
    };
    fetchTasks();
  }, []);

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
    setIsActive(false);
  };

  const notifyTimeUp = useCallback(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Time's Up!", {
        body: `${MODES[mode].label} session is complete.`,
        icon: "/favicon.ico"
      });
    }
    showToast(`${MODES[mode].label} time is up!`, "success");
  }, [mode, showToast]);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
      notifyTimeUp();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, notifyTimeUp]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].time);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="focus-container">
      <motion.section
        className="focus-header glass-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>
            Focus Mode{" "}
            <Timer
              size={24}
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginLeft: "10px",
                color: "var(--primary)",
              }}
            />
          </h1>
          <p>Eliminate distractions and get work done with the Pomodoro technique.</p>
        </div>
      </motion.section>

      <div className="focus-content">
        <motion.div 
          className="timer-card glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="timer-modes">
            {Object.entries(MODES).map(([key, val]) => (
              <button
                key={key}
                className={`timer-mode-btn ${mode === key ? "active" : ""}`}
                onClick={() => switchMode(key)}
              >
                {val.label}
              </button>
            ))}
          </div>

          <div className="timer-display">
            {formatTime(timeLeft)}
          </div>

          <div className="timer-controls">
            <button className="timer-btn primary" onClick={toggleTimer}>
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              {isActive ? "Pause" : "Start"}
            </button>
            <button className="timer-btn secondary" onClick={resetTimer}>
              <RotateCcw size={20} />
            </button>
          </div>

          <select 
            className="task-selector" 
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            <option value="">-- Select a task to focus on (Optional) --</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>
        </motion.div>
      </div>
    </div>
  );
}

export default Focus;
