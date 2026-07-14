import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { motion } from "framer-motion";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import {
    CheckSquare,
    ShieldCheck,
    Zap,
    Mail,
    Lock,
    ArrowRight,
} from "lucide-react";

import "../styles/auth.css";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();
    const { showToast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const redirectTo =
        location.state?.from?.pathname || "/dashboard";

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            showToast(
                "Please fill in all required fields.",
                "warning"
            );
            return;
        }

        try {
            setLoading(true);

            const { data } = await API.post(
                "/auth/login",
                {
                    email: email.trim(),
                    password,
                }
            );

            login(data);

            showToast(
                `Welcome back, ${data.user.username}! 👋`,
                "success"
            );

            navigate(redirectTo, {
                replace: true,
            });
        } catch (error) {
            console.error(error);

            showToast(
                error.response?.data?.message ||
                    "Invalid email or password.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <motion.div
                className="auth-card glass-card"
                initial={{
                    opacity: 0,
                    y: 40,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.45,
                }}
            >
                <div className="brand-section">

                    <div className="brand-logo">
                        <CheckSquare size={44} />
                    </div>

                    <h1>TaskFlow</h1>

                    <p>
                        Premium Productivity Workspace
                    </p>

                </div>

                <div className="auth-heading">

                    <h2>Welcome Back 👋</h2>

                    <p>
                        Sign in to continue managing your
                        workflow efficiently.
                    </p>

                </div>

                <form
                    className="auth-form"
                    onSubmit={handleLogin}
                >
                    <div className="input-group">

                        <Mail size={18} />

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            autoComplete="email"
                        />

                    </div>

                    <div className="input-group">

                        <Lock size={18} />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            autoComplete="current-password"
                        />

                    </div>

                    <motion.button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                        whileHover={{
                            scale: loading ? 1 : 1.02,
                        }}
                        whileTap={{
                            scale: loading ? 1 : 0.98,
                        }}
                    >
                        {loading ? (
                            "Signing In..."
                        ) : (
                            <>
                                Login
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="feature-row">

                    <div>
                        <ShieldCheck size={18} />
                        Secure Authentication
                    </div>

                    <div>
                        <Zap size={18} />
                        Lightning Fast
                    </div>

                </div>

                <div className="auth-link">

                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create Account
                    </button>

                </div>

            </motion.div>

        </div>
    );
}

export default Login;