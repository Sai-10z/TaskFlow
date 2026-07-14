import { memo } from "react";
import { motion } from "framer-motion";

function KPICard({
    title,
    value,
    icon,
    color = "",
    loading = false,
}) {
    return (
        <motion.div
            className={`kpi-card glass-card ${color}`}
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            whileHover={{
                y: -8,
                scale: 1.03,
            }}
            whileTap={{
                scale: 0.98,
            }}
            transition={{
                duration: 0.25,
            }}
        >
            <div className="kpi-card-top">

                <div className="kpi-icon">
                    {icon}
                </div>

            </div>

            <div className="kpi-content">

                <span className="kpi-title">
                    {title}
                </span>

                <motion.h2
                    className="kpi-value"
                    key={loading ? "loading" : value}
                    initial={{
                        opacity: 0,
                        scale: 0.9,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.25,
                    }}
                >
                    {loading ? "--" : value}
                </motion.h2>

            </div>

            <div className="kpi-footer">
                <small>Live Statistics</small>
            </div>
        </motion.div>
    );
}

export default memo(KPICard);