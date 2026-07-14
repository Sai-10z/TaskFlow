import {
    useNavigate
} from "react-router-dom";
import {
    useAuth
} from "../context/AuthContext";
import {
    useToast
} from "../context/ToastContext";
import {
    CheckSquare,
    LayoutDashboard,
    ListTodo,
    LogOut
} from "lucide-react";

import "../styles/dashboard.css";

function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { showToast } = useToast();

    const handleLogout = () => {
        logout();

        showToast(
            "Successfully logged out 👋",
            "success"
        );

        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <CheckSquare size={30} />
                <h2>TaskFlow</h2>
            </div>
            <div className="nav-links">
                <button onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard size={18} />
                    Dashboard
                </button>
                <button onClick={() => navigate("/tasks")}>
                    <ListTodo size={18} />
                    Tasks
                </button>
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;