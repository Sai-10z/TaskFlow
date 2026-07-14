import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";

/**
 * Shared layout for all authenticated pages.
 * This prevents repeating the Sidebar + Main wrapper
 * for every protected route.
 */
function AppLayout({ children }) {
    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ===========================
                    Public Routes
                ============================ */}

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ===========================
                    Protected Routes
                ============================ */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Dashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Tasks />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                {/* ===========================
                    Redirects
                ============================ */}

                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;