import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Mail, Lock, ArrowRight } from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";
import SocialLogin from "../components/auth/SocialLogin";
import { CheckSquare } from "lucide-react";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Please fill in all required fields.", "warning");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      login(data);
      showToast(`Welcome back, ${data.user.username}! 👋`, "success");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.message || "Invalid email or password.",
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

          <h1>Manage your workflow effortlessly.</h1>
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
            <h2>Welcome Back</h2>
            <p>Sign in to continue managing your workflow.</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
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
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Signing In..." : (
                <>
                  Continue
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <SocialLogin />

          <div className="auth-footer">
            <Link to="/register" className="auth-link">
              Don't have an account? <span className="auth-link-highlight">→ Create Account</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}

export default Login;
