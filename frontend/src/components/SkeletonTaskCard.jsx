import { motion } from "framer-motion";

function SkeletonTaskCard() {
  return (
    <motion.div
      className="task-card skeleton-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="task-main">
        <div className="task-title-row">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-badge"></div>
        </div>
        <div className="skeleton-line skeleton-desc"></div>
        <div className="skeleton-line skeleton-desc short"></div>
        <div className="task-bottom-row">
          <div className="skeleton-line skeleton-date"></div>
          <div className="skeleton-circle"></div>
        </div>
      </div>
    </motion.div>
  );
}

export default SkeletonTaskCard;
