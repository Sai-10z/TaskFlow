import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Mail, Palette, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/settings.css";

function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="settings-container">
      <motion.section
        className="settings-header glass-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>
            Settings{" "}
            <SettingsIcon
              size={24}
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginLeft: "10px",
                color: "var(--primary)",
              }}
            />
          </h1>
          <p>Manage your account preferences and application experience.</p>
        </div>
      </motion.section>

      <div className="settings-grid">
        <motion.div
          className="settings-card glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3>
            <User size={18} /> Profile Information
          </h3>

          <div className="settings-content">
            <div className="info-group">
              <label>Username</label>
              <div className="info-val">
                <User size={16} />
                <span>{user?.username || "N/A"}</span>
              </div>
            </div>

            <div className="info-group">
              <label>Email Address</label>
              <div className="info-val">
                <Mail size={16} />
                <span>{user?.email || "N/A"}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="settings-card glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3>
            <Palette size={18} /> Preferences
          </h3>

          <div className="settings-content">
            <div className="info-group">
              <label>App Theme</label>
              <div className="theme-toggle-wrapper">
                <button 
                  className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Settings;
