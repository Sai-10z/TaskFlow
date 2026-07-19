import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function StatCounter({ target, label, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    let end = typeof target === 'number' ? target : parseInt(target.toString().replace(/,/g, "").replace(/K/g, "000"), 10) || 0;
    if (end === 0) return;

    const duration = 1500; // 1.5s
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  const displayCount = count >= 10000 ? (count / 1000).toFixed(0) + 'K' : count >= 1000 ? (count / 1000).toFixed(1).replace('.0', '') + 'K' : count;

  // Handle percentages directly if passed as a string with %
  const isPercent = typeof target === 'string' && target.includes('%');
  const finalDisplay = isPercent ? target : `${prefix}${displayCount}${suffix}`;

  return (
    <motion.div 
      className="stat-counter"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="stat-value">{finalDisplay}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}

export default StatCounter;
