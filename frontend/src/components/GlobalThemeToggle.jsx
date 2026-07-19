import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

function GlobalThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{
      position: "fixed",
      top: "12px",
      right: "20px",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: "16px",
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      padding: "8px 16px",
      borderRadius: "30px",
      boxShadow: "var(--shadow-md)"
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", color: "var(--text-primary)" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>{formatTime(time)}</span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDate(time)}</span>
      </div>

      <div style={{ width: "1px", height: "24px", background: "var(--border-color)" }}></div>

      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: "4px",
          filter: theme === "dark" 
            ? "drop-shadow(0 0 10px rgba(251, 146, 60, 0.8))" 
            : "drop-shadow(0 0 10px rgba(253, 224, 71, 0.8))"
        }}
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      >
        {theme === "dark" ? <Sun size={20} color="#fb923c" /> : <Moon size={20} color="#fde047" />}
      </motion.button>
    </div>
  );
}

export default GlobalThemeToggle;
