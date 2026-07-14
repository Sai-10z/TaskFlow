import {
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");

            return storedUser
                ? JSON.parse(storedUser)
                : null;
        } catch (error) {
            console.error("Failed to parse stored user:", error);

            localStorage.removeItem("user");

            return null;
        }
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    const [isLoading] = useState(false);

    const login = ({ token, user }) => {
        if (!token || !user) {
            console.error("Invalid login data.");
            return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        if (!updatedUser) return;

        setUser(updatedUser);

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );
    };

    const value = useMemo(
        () => ({
            user,
            token,
            login,
            logout,
            updateUser,
            isLoading,
            isAuthenticated: Boolean(token && user),
        }),
        [user, token, isLoading]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within an AuthProvider."
        );
    }

    return context;
}