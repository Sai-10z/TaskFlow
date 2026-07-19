import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import PriorityBadge from "./PriorityBadge";
import {
  CheckCircle2,
  Edit3,
  Trash2,
  Clock3,
  FileText,
  X,
  CheckSquare,
} from "lucide-react";

function TaskDetailsPanel({
  task,
  onClose,
  onEdit,
  onDelete,
  onComplete,
  onToggleSubtask,
}) {
  if (!task) return null;
  const createdDate = new Date(task.created_at).toLocaleDateString();
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;

  let isOverdue = false;
  if (deadlineDate && !task.completed) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineDate);
    deadline.setHours(0, 0, 0, 0);
    isOverdue = deadline < today;
  }

  const completedSubtasks = task.subtasks
    ? task.subtasks.filter((st) => st.is_completed).length
    : 0;
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;

  return (
    <AnimatePresence>
      <motion.div
        className="panel-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <motion.div
          className="modal-panel"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "780px",
            maxHeight: "90vh",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "24px",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <div
            className="panel-header"
            style={{
              padding: "24px 32px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              backgroundColor: "var(--bg-card)",
              zIndex: 10,
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                margin: 0,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {task.completed ? (
                <CheckCircle2 size={24} color="var(--success)" />
              ) : (
                <Clock3 size={24} color="var(--primary)" />
              )}
              Task Details
            </h2>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div
            className="panel-content"
            style={{
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* Title and Priority */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <h1
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "var(--text-primary)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {task.title}
                </h1>
                <PriorityBadge
                  priority={task.completed ? "COMPLETED" : task.priority}
                />
              </div>
            </div>

            {/* Layout Grid for Main Content vs Metadata */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "32px",
              }}
            >
              {/* Left Column: Description & Subtasks */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "32px",
                }}
              >
                <div className="panel-section">
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FileText size={16} /> Description
                  </h3>
                  <div
                    className="markdown-preview"
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "15px",
                      lineHeight: "1.7",
                      background: "var(--bg-secondary)",
                      padding: "20px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {task.description ? (
                      <ReactMarkdown>{task.description}</ReactMarkdown>
                    ) : (
                      <span style={{ fontStyle: "italic", opacity: 0.7 }}>
                        No description provided.
                      </span>
                    )}
                  </div>
                </div>

                {totalSubtasks > 0 && (
                  <div className="panel-section">
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <CheckSquare size={16} /> Subtasks ({completedSubtasks}/
                      {totalSubtasks})
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "6px",
                          background: "var(--border-color)",
                          borderRadius: "3px",
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
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {task.subtasks.map((st, index) => (
                        <div
                          key={index}
                          onClick={() => onToggleSubtask(task.id, index)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            background: "var(--bg-secondary)",
                            padding: "12px 16px",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-color)",
                            cursor: "pointer",
                            transition: "var(--transition)",
                          }}
                          className="subtask-row"
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "6px",
                              background: st.is_completed
                                ? "var(--primary)"
                                : "transparent",
                              border: st.is_completed
                                ? "none"
                                : "2px solid var(--border-color-hover)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {st.is_completed && (
                              <CheckCircle2 size={14} color="white" />
                            )}
                          </div>
                          <span
                            style={{
                              color: st.is_completed
                                ? "var(--text-muted)"
                                : "var(--text-primary)",
                              textDecoration: st.is_completed
                                ? "line-through"
                                : "none",
                              fontSize: "15px",
                            }}
                          >
                            {st.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Metadata & Actions */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div
                  className="panel-section"
                  style={{
                    background: "var(--bg-secondary)",
                    padding: "20px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "16px",
                    }}
                  >
                    Properties
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "14px",
                          color: "var(--text-muted)",
                          marginBottom: "4px",
                        }}
                      >
                        Status
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: task.completed
                            ? "var(--success)"
                            : "var(--text-primary)",
                        }}
                      >
                        {task.completed ? "Completed" : "In Progress"}
                      </span>
                    </div>

                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "14px",
                          color: "var(--text-muted)",
                          marginBottom: "4px",
                        }}
                      >
                        Created
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                        }}
                      >
                        {createdDate}
                      </span>
                    </div>

                    {deadlineDate && (
                      <div>
                        <span
                          style={{
                            display: "block",
                            fontSize: "14px",
                            color: "var(--text-muted)",
                            marginBottom: "4px",
                          }}
                        >
                          Deadline
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: isOverdue
                                ? "var(--danger)"
                                : "var(--text-primary)",
                            }}
                          >
                            {deadlineDate.toLocaleDateString()}
                          </span>
                          {isOverdue && (
                            <span
                              style={{
                                background: "rgba(239, 68, 68, 0.1)",
                                color: "var(--danger)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "10px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                              }}
                            >
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="panel-section"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {!task.completed && (
                    <button
                      type="button"
                      onClick={() => onComplete(task.id)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "var(--radius-md)",
                        background: "rgba(16, 185, 129, 0.1)",
                        color: "var(--success)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      <CheckCircle2 size={18} /> Complete Task
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEdit(task);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    <Edit3 size={18} /> Edit Task
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onDelete(task.id);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      background: "rgba(239, 68, 68, 0.05)",
                      color: "var(--danger)",
                      border: "1px solid rgba(239, 68, 68, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    <Trash2 size={18} /> Delete Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TaskDetailsPanel;
