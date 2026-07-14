import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./styles/global.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/tasks.css";
import "./styles/sidebar.css";
import "./styles/toast.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found.");
}

createRoot(rootElement).render(
    <StrictMode>
        <AuthProvider>
            <ThemeProvider>
                <ToastProvider>
                    <App />
                </ToastProvider>
            </ThemeProvider>
        </AuthProvider>
    </StrictMode>
);