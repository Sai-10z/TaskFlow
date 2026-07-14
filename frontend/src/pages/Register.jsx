import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import API from "../api/axios";
import { useToast } from "../context/ToastContext";

import {
    CheckSquare,
    ShieldCheck,
    Zap,
    UserPlus,
    User,
    Mail,
    Lock,
    ArrowRight,
} from "lucide-react";

import "../styles/auth.css";

function Register() {
    const navigate = useNavigate();

    const { showToast } = useToast();

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (
            !username.trim() ||
            !email.trim() ||
            !password.trim()
        ) {
            showToast(
                "Please fill in all required fields.",
                "warning"
            );
            return;
        }

        try {
            setLoading(true);

            await API.post("/auth/register", {
                username: username.trim(),
                email: email.trim(),
                password,
            });

            showToast(
                "Account created successfully 🎉",
                "success"
            );

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            console.error(error);

            showToast(
                error.response?.data?.message ||
                    "Registration failed.",
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
                    <h2>Create Account 🚀</h2>

                    <p>
                        Join TaskFlow and organize your
                        work like never before.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleRegister}
                >
                    <div className="input-group">
                        <User size={18} />

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-group">
                        <Mail size={18} />

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
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
                                setPassword(
                                    e.target.value
                                )
                            }
                            autoComplete="new-password"
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
                            "Creating Account..."
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="feature-row">
                    <div>
                        <ShieldCheck size={18} />
                        Secure
                    </div>

                    <div>
                        <Zap size={18} />
                        Fast Setup
                    </div>

                    <div>
                        <UserPlus size={18} />
                        Ready in Minutes
                    </div>
                </div>

                <div className="auth-link">
                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default Register;