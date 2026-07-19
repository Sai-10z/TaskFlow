import { motion } from "framer-motion";
import { Sparkles, Rocket } from "lucide-react";

function FeatureCard({ title, description, icon = "rocket" }) {
  return (
    <motion.div 
      className="feature-glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="feature-card-header">
        <h3>{title}</h3>
        {icon === "rocket" ? <Rocket size={20} className="feature-icon text-blue" /> : <Sparkles size={20} className="feature-icon text-purple" />}
      </div>
      <p>{description}</p>
    </motion.div>
  );
}

export default FeatureCard;
