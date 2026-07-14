import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import Toast from "../components/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const timerRef = useRef(null);

    const clearToastTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const hideToast = useCallback(() => {
        clearToastTimer();
        setToast(null);
    }, [clearToastTimer]);

    const showToast = useCallback(
        (
            message,
            type = "success",
            duration = 3000
        ) => {
            clearToastTimer();

            setToast({
                message,
                type,
            });

            timerRef.current = setTimeout(() => {
                setToast(null);
                timerRef.current = null;
            }, duration);
        },
        [clearToastTimer]
    );

    useEffect(() => {
        return () => {
            clearToastTimer();
        };
    }, [clearToastTimer]);

    const value = useMemo(
        () => ({
            showToast,
            hideToast,
        }),
        [showToast, hideToast]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}

            <Toast
                toast={toast}
                onClose={hideToast}
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used within a ToastProvider."
        );
    }

    return context;
}