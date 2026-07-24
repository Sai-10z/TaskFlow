import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";
import PasswordStrength from "../components/auth/PasswordStrength";
import SocialLogin from "../components/auth/SocialLogin";
import { CheckSquare } from "lucide-react";
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

    if (!username.trim() || !email.trim() || !password.trim()) {
      showToast("Please fill in all required fields.", "warning");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        username: username.trim(),
        email: email.trim(),
        password,
      });

      showToast("Account created successfully 🎉", "success");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.message || "Registration failed.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        layoutId="auth-hero"
        className="auth-hero-section"
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ background: "var(--primary)", padding: "12px", borderRadius: "14px", display: "flex" }}>
              <CheckSquare size={36} color="white" />
            </div>
            <span style={{ fontSize: "2.2rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>TaskFlow</span>
          </div>

          <h1>Build better habits with TaskFlow.</h1>
        </motion.div>
      </motion.div>

      <motion.div
        layoutId="auth-form"
        className="auth-form-section"
      >
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="auth-card-heading">
            <h2>Create Account</h2>
            <p>Join TaskFlow and organize your work.</p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="input-group">
              <User size={18} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="input-group">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <PasswordStrength password={password} />

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : (
                <>
                  Continue
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <SocialLogin />

          <div className="auth-footer">
            <Link to="/login" className="auth-link">
              Already have an account? <span className="auth-link-highlight">→ Sign In</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}

export default Register;
