import { useMemo } from "react";
import { motion } from "framer-motion";
import PriorityBadge from "./PriorityBadge";
import { Draggable } from "@hello-pangea/dnd";

import {
  CheckCircle2,
  CalendarDays,
  Clock3,
  Eye,
  AlertTriangle,
  CheckSquare,
} from "lucide-react";

function TaskCard({ task, index, onViewDetails }) {
  const cardType = task.completed ? "completed" : task.priority?.toLowerCase();

  const deadlineDate = useMemo(() => {
    if (!task.deadline) return null;
    return new Date(task.deadline);
  }, [task.deadline]);

  const isOverdue = useMemo(() => {
    if (!deadlineDate || task.completed) return false;
    const today = new Date();
    const deadline = new Date(deadlineDate);
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  }, [deadlineDate, task.completed]);



  const completedSubtasks = task.subtasks
    ? task.subtasks.filter((st) => st.is_completed).length
    : 0;
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <>
          <motion.div
            layout
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`task-card ${cardType}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            style={{
              ...provided.draggableProps.style,
            }}
          >
            <div
              className={`task-main ${snapshot.isDragging ? "tilting" : ""}`}
            >
              <div className="task-title-row">
                <h2>{task.title}</h2>
                <PriorityBadge
                  priority={task.completed ? "COMPLETED" : task.priority}
                />
              </div>



              {totalSubtasks > 0 && (
                <div
                  style={{
                    marginTop: "12px",
                    background: "var(--bg-secondary)",
                    padding: "8px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <CheckSquare size={14} color="var(--primary)" />
                  <div
                    style={{
                      flex: 1,
                      height: "4px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: "var(--primary)",
                        width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "var(--text-muted)",
                    }}
                  >
                    {completedSubtasks}/{totalSubtasks}
                  </span>
                </div>
              )}

              {task.deadline && (
                <div
                  className="created-date"
                  style={{ marginTop: totalSubtasks > 0 ? "12px" : "0" }}
                >
                  <CalendarDays size={15} />
                  <span>
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                  {isOverdue && (
                    <span className="overdue-badge">
                      <AlertTriangle size={13} /> Overdue
                    </span>
                  )}
                </div>
              )}

              <div className="task-bottom-row">
                <div className="task-status">
                  {task.completed ? (
                    <>
                      <CheckCircle2 size={15} /> Completed
                    </>
                  ) : (
                    <>
                      <Clock3 size={15} /> Pending
                    </>
                  )}
                </div>
                <button
                  type="button"
                  className="details-button"
                  onClick={() => onViewDetails(task)}
                  aria-label="View task"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </Draggable>
  );
}

export default TaskCard;
