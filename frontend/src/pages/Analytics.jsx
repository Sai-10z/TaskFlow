import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import API from "../api/axios";
import { useToast } from "../context/ToastContext";
import {
  BarChart2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Hash,
} from "lucide-react";
import "../styles/analytics.css";

function Analytics() {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await API.get("/tasks");
        setTasks(data);
      } catch (error) {
        console.error(error);
        showToast("Failed to load analytics data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [showToast]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    let total = tasks.length;
    let completed = 0;
    let overdue = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach((task) => {
      if (task.completed) {
        completed++;
      } else if (task.deadline) {
        const deadline = new Date(task.deadline);
        deadline.setHours(0, 0, 0, 0);
        if (deadline < today) {
          overdue++;
        }
      }
    });

    const pending = total - completed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, completionRate };
  }, [tasks]);

  // Prepare data for Priority Pie Chart
  const priorityData = useMemo(() => {
    let high = 0,
      medium = 0,
      low = 0;
    tasks.forEach((task) => {
      if (!task.completed) {
        if (task.priority === "HIGH") high++;
        if (task.priority === "MEDIUM") medium++;
        if (task.priority === "LOW") low++;
      }
    });
    return [
      { name: "High", value: high, color: "var(--danger)" },
      { name: "Medium", value: medium, color: "var(--warning)" },
      { name: "Low", value: low, color: "var(--success)" },
    ];
  }, [tasks]);

  return (
    <div className="analytics-container">
      <motion.section
        className="analytics-header glass-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>
            Dashboard{" "}
            <BarChart2
              size={24}
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginLeft: "10px",
                color: "var(--primary)",
              }}
            />
          </h1>
          <p>
            Track your productivity, task distribution, and overall progress.
          </p>
        </div>
      </motion.section>

      {loading ? (
        <div className="analytics-loading">
          <h2>Loading insights...</h2>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="kpi-grid">
            <motion.div
              className="kpi-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                className="kpi-icon"
                style={{
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "var(--primary)",
                }}
              >
                <Hash size={24} />
              </div>
              <div className="kpi-content">
                <h3>Total Tasks</h3>
                <p className="kpi-value">{kpis.total}</p>
              </div>
            </motion.div>

            <motion.div
              className="kpi-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className="kpi-icon"
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "var(--success)",
                }}
              >
                <CheckCircle size={24} />
              </div>
              <div className="kpi-content">
                <h3>Completed</h3>
                <p className="kpi-value">{kpis.completed}</p>
                <span className="kpi-subtitle">
                  {kpis.completionRate}% completion rate
                </span>
              </div>
            </motion.div>

            <motion.div
              className="kpi-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div
                className="kpi-icon"
                style={{
                  background: "rgba(245, 158, 11, 0.1)",
                  color: "var(--warning)",
                }}
              >
                <Clock size={24} />
              </div>
              <div className="kpi-content">
                <h3>Pending</h3>
                <p className="kpi-value">{kpis.pending}</p>
              </div>
            </motion.div>

            <motion.div
              className="kpi-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div
                className="kpi-icon"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "var(--danger)",
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <div className="kpi-content">
                <h3>Overdue</h3>
                <p
                  className="kpi-value"
                  style={{
                    color: kpis.overdue > 0 ? "var(--danger)" : "inherit",
                  }}
                >
                  {kpis.overdue}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            <motion.div
              className="chart-card glass-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3>Pending Tasks by Priority</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          className="pie-sector-cell"
                          style={{ '--cell-color': entry.color, outline: "none" }} 
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--bg-card)",
                        borderColor: "var(--border-color)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--text-primary)",
                      }}
                      itemStyle={{ color: "var(--text-primary)" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
