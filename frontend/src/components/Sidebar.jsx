import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    ListTodo,
    LogOut,
    CheckSquare,
    User,
    ChevronRight,
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
    ];

    const handleNavigation = (path) => {
        if (location.pathname !== path) {
            navigate(path);
        }
    };

    const handleLogout = () => {
        logout();

        showToast(
            "Successfully logged out 👋",
            "success"
        );

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
                    <span>Productivity Suite</span>
                </div>
            </div>

            <div className="sidebar-user">
                <div className="sidebar-avatar">
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="sidebar-user-info">
                    <p>{user?.username || "User"}</p>
                    <span>Productivity Workspace</span>
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

                        <ChevronRight
                            size={16}
                            className="sidebar-arrow"
                        />
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="sidebar-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;