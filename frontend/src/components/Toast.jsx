import { AnimatePresence, motion } from "framer-motion";

import {
    CheckCircle2,
    AlertTriangle,
    Info,
    XCircle,
    X,
} from "lucide-react";

import { useToast } from "../context/ToastContext";

import "../styles/toast.css";

function Toast() {

    const {
        toasts,
        removeToast,
    } = useToast();

    const icons = {
        success: <CheckCircle2 size={20} />,
        error: <XCircle size={20} />,
        warning: <AlertTriangle size={20} />,
        info: <Info size={20} />,
    };
        return (

        <div className="toast-container">

            <AnimatePresence>

                {toasts.map((toast) => (

                    <motion.div
                        key={toast.id}
                        className={`toast toast-${toast.type}`}
                        initial={{
                            opacity: 0,
                            x: 120,
                            scale: 0.9,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            x: 120,
                            scale: 0.9,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                    >

                        <div className="toast-icon">

                            {icons[toast.type] || icons.info}

                        </div>

                        <div className="toast-content">

                            <p>
                                {toast.message}
                            </p>

                        </div>                        <button
                            className="toast-close"
                            onClick={() =>
                                removeToast(toast.id)
                            }
                        >
                            <X size={18} />
                        </button>

                    </motion.div>

                ))}

            </AnimatePresence>

        </div>

    );
}

export default Toast;