import { memo } from "react";
import { Flame, Minus, Leaf, CheckCircle2 } from "lucide-react";

function PriorityBadge({ priority }) {
  const level = (priority || "LOW").toUpperCase();

  const config = {
    HIGH: {
      label: "High",
      icon: <Flame size={14} />,
      className: "priority-high",
    },
    MEDIUM: {
      label: "Medium",
      icon: <Minus size={14} />,
      className: "priority-medium",
    },
    LOW: {
      label: "Low",
      icon: <Leaf size={14} />,
      className: "priority-low",
    },
    COMPLETED: {
      label: "Completed",
      icon: <CheckCircle2 size={14} />,
      className: "priority-completed",
    },
  };

  const current = config[level] || config.LOW;

  return (
    <span className={`priority-badge ${current.className}`}>
      <span className="priority-icon">{current.icon}</span>

      <span className="priority-text">{current.label}</span>
    </span>
  );
}

export default memo(PriorityBadge);
