import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  LogOut,
  CheckSquare,
  ChevronRight,
  Calendar,
  Timer,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Tasks",
      path: "/tasks",
      icon: ListTodo,
    },
    {
      label: "Calendar",
      path: "/calendar",
      icon: Calendar,
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: ({ size }) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-bar-chart-2"
        >
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
    },

    {
      label: "Settings",
      path: "/settings",
      icon: ({ size }) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-settings"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
    },
  ];

  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();

    showToast("Successfully logged out 👋", "error");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <CheckSquare size={34} />

        <div>
          <h2>TaskFlow</h2>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <button
            key={path}
            className={`sidebar-link ${
              location.pathname === path ? "active" : ""
            }`}
            onClick={() => handleNavigation(path)}
          >
            <div className="sidebar-link-left">
              <Icon size={20} />
              <span>{label}</span>
            </div>

            <ChevronRight size={16} className="sidebar-arrow" />
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
