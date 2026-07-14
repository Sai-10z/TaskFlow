import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import API from "../api/axios";
import KPICard from "../components/KPICard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import {
    ListTodo,
    CheckCircle,
    Clock,
    ArrowRight,
    Sparkles,
    TrendingUp,
    CalendarClock,
    AlertTriangle,
} from "lucide-react";

import "../styles/dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const { user } = useAuth();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,

        overdue: 0,
        dueTomorrow: 0,

        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,

        dueToday: 0,
        completionRate: 0,
    });

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await API.get("/tasks");

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            let completed = 0;

            let overdue = 0;
            let dueTomorrow = 0;
            let dueToday = 0;

            let highPriority = 0;
            let mediumPriority = 0;
            let lowPriority = 0;

            data.forEach((task) => {

                if (task.completed) {
                    completed++;
                }

                switch (task.priority) {

                    case "HIGH":
                        highPriority++;
                        break;

                    case "MEDIUM":
                        mediumPriority++;
                        break;

                    default:
                        lowPriority++;
                }

                if (task.deadline) {

                    const deadline = new Date(task.deadline);
                    deadline.setHours(0, 0, 0, 0);

                    if (!task.completed && deadline < today) {
                        overdue++;
                    }

                    if (
                        !task.completed &&
                        deadline.getTime() === today.getTime()
                    ) {
                        dueToday++;
                    }

                    if (
                        !task.completed &&
                        deadline.getTime() === tomorrow.getTime()
                    ) {
                        dueTomorrow++;
                    }
                }

            });

            const completionRate =
                data.length === 0
                    ? 0
                    : Math.round((completed / data.length) * 100);

            setStats({
                total: data.length,
                completed,
                pending: data.length - completed,

                overdue,
                dueTomorrow,
                dueToday,

                highPriority,
                mediumPriority,
                lowPriority,

                completionRate,
            });

        } catch (error) {

            console.error(error);

            showToast(
                "Unable to load dashboard statistics.",
                "error"
            );

        } finally {

            setLoading(false);

        }

    }, [showToast]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const motivation = useMemo(() => {
        if (stats.total === 0) {
            return {
                title: "Let's Get Started 🚀",
                subtitle:
                    "Create your first task and start organizing your workflow.",
            };
        }

        if (stats.overdue > 0) {
            return {
                title: "Overdue Tasks Found ⚠️",
                subtitle: `You have ${stats.overdue} overdue task${
                    stats.overdue > 1 ? "s" : ""
                }. Try completing them first.`,
            };
        }

        if (stats.dueTomorrow > 0) {
            return {
                title: "Upcoming Deadlines 📅",
                subtitle: `${stats.dueTomorrow} task${
                    stats.dueTomorrow > 1 ? "s are" : " is"
                } due tomorrow.`,
            };
        }

        if (stats.pending === 0 && stats.total > 0) {
            return {
                title: "Everything Completed 🎉",
                subtitle:
                    "Great job! You don't have any pending work right now.",
            };
        }

        return {
            title: "Keep Going 💪",
            subtitle:
                "Complete today's tasks and stay productive throughout the day.",
        };
    }, [stats]);

    const overviewWidth = useMemo(() => {
        if (stats.total === 0) return 0;

        return Math.round(
            (stats.completed / stats.total) * 100
        );
    }, [stats]);
        return (
        <div className="dashboard-container">

            <motion.section
                className="dashboard-header glass-card"
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="dashboard-header-content">

                    <div>
                        <div className="welcome-chip">
                            <Sparkles size={15} />
                            Welcome Back
                        </div>

                        <h1>
                            Hello,{" "}
                            <span>
                                {user?.username || "User"}
                            </span>{" "}
                            👋
                        </h1>

                        <p>
                            Organize your work, stay on top of deadlines,
                            and keep your productivity moving forward.
                        </p>
                    </div>

                    <div className="dashboard-alert-box">
                        {stats.overdue > 0 ? (
                            <>
                                <AlertTriangle size={28} />
                                <div>
                                    <h3>
                                        {stats.overdue} Overdue Task
                                        {stats.overdue > 1 ? "s" : ""}
                                    </h3>

                                    <small>
                                        Complete them as soon as possible.
                                    </small>
                                </div>
                            </>
                        ) : (
                            <>
                                <CalendarClock size={28} />
                                <div>
                                    <h3>
                                        {stats.dueTomorrow} Due Tomorrow
                                    </h3>

                                    <small>
                                        Upcoming deadlines are shown here.
                                    </small>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </motion.section>

            <motion.section
                className="kpi-container"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.15,
                    duration: 0.45,
                }}
            >

                <KPICard
                    title="Total Tasks"
                    value={loading ? "--" : stats.total}
                    trend="100%"
                    icon={<ListTodo size={28} />}
                />

                <KPICard
                    title="Completed"
                    value={loading ? "--" : stats.completed}
                    trend={`${stats.completionRate}%`}
                    icon={<CheckCircle size={28} />}
                />

                <KPICard
                    title="Pending"
                    value={loading ? "--" : stats.pending}
                    trend={`${stats.pending}`}
                    icon={<Clock size={28} />}
                />

                <KPICard
                    title="Overdue"
                    value={loading ? "--" : stats.overdue}
                    trend={
                        stats.overdue
                            ? `${stats.overdue}`
                            : "0"
                    }
                    icon={<AlertTriangle size={28} />}
                />

                <KPICard
                    title="Due Today"
                    value={loading ? "--" : stats.dueToday}
                    trend={
                        stats.dueToday
                            ? `${stats.dueToday}`
                            : "0"
                    }
                    icon={<CalendarClock size={28} />}
                />

                <KPICard
                    title="Completion"
                    value={
                        loading
                            ? "--"
                            : `${stats.completionRate}%`
                    }
                    trend="+"
                    icon={<TrendingUp size={28} />}
                />

            </motion.section>

            <motion.section
                className="dashboard-overview"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.45,
                }}
            >
                <div className="overview-card glass-card">

                    <div className="overview-top">

                        <div>
                            <span className="overview-label">
                                Task Overview
                            </span>

                            <h2>{motivation.title}</h2>
                        </div>

                        <TrendingUp size={34} />

                    </div>

                    <p>{motivation.subtitle}</p>

                    <div className="progress-track">
                        <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${overviewWidth}%`,
                            }}
                            transition={{
                                duration: 0.9,
                            }}
                        />
                    </div>

                    <div className="overview-stats">

                        <div>
                            <CheckCircle size={18} />
                            <span>
                                {stats.completed} Completed
                            </span>
                        </div>

                        <div>
                            <Clock size={18} />
                            <span>
                                {stats.pending} Pending
                            </span>
                        </div>

                        <div>
                            <AlertTriangle size={18} />
                            <span>
                                {stats.overdue} Overdue
                            </span>
                        </div>

                    </div>

                </div>

                <div className="quick-action glass-card">

                    <h3>Open Your Workspace</h3>

                    <p>
                        Create, edit, organize and complete your tasks
                        from the task board.
                    </p>

                    <motion.button
                        className="view-button"
                        whileHover={{
                            scale: 1.04,
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                        onClick={() => navigate("/tasks")}
                    >
                        Open Task Board
                        <ArrowRight size={18} />
                    </motion.button>

                </div>

            </motion.section>

        </div>
    );
}

export default Dashboard;