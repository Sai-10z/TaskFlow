import { motion } from "framer-motion";
import { Check } from "lucide-react";

function FeatureChip({ text, delay = 0 }) {
  return (
    <motion.div 
      className="feature-chip"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="feature-chip-icon">
        <Check size={14} strokeWidth={3} />
      </div>
      <span>{text}</span>
    </motion.div>
  );
}

export default FeatureChip;
