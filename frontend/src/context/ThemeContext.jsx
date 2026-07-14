import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../api/axios";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { user, updateUser } = useAuth();
    
    // Default to dark mode unless user prefers light
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        if (user && user.theme) {
            setTheme(user.theme);
        } else {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) {
                setTheme(savedTheme);
            }
        }
    }, [user]);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = async () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        
        if (user) {
            try {
                const { data } = await api.put("/users/profile", { theme: newTheme });
                updateUser({ ...user, theme: newTheme });
            } catch (error) {
                console.error("Failed to save theme to backend", error);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
