import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Pencil,
  X,
  CalendarDays,
  CheckSquare,
  Trash2,
  Eye,
  Edit2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

function TaskModal({
  show,
  editingId,
  title,
  description,
  priority,
  deadline,
  subtasks = [],
  setTitle,
  setDescription,
  setPriority,
  setDeadline,
  setSubtasks,
  saveTask,
  closeModal,
}) {
  const [newSubtask, setNewSubtask] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const handleAddSubtask = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const title = newSubtask.trim();
      if (title) {
        setSubtasks([...subtasks, { title, is_completed: false }]);
      }
      setNewSubtask("");
    }
  };

  const toggleSubtask = (index) => {
    const updated = [...subtasks];
    updated[index].is_completed = !updated[index].is_completed;
    setSubtasks(updated);
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeModal}
        >
          <motion.div
            className="task-modal glass-card"
            style={{ maxHeight: "90vh", overflowY: "auto", width: "500px" }}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="close-modal"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="task-modal-header">
              <div className="task-modal-icon">
                {editingId ? <Pencil size={22} /> : <Plus size={22} />}
              </div>
              <div>
                <h2>{editingId ? "Edit Task" : "Create Task"}</h2>
                <p>
                  {editingId
                    ? "Update your task information."
                    : "Create a new task for your workflow."}
                </p>
              </div>
            </div>

            <form className="task-form" onSubmit={saveTask}>
              <div className="form-group">
                <label htmlFor="task-title">Task Title</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label htmlFor="task-description" style={{ marginBottom: 0 }}>
                    Description (Markdown)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--primary)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {isPreview ? (
                      <>
                        <Edit2 size={14} /> Edit
                      </>
                    ) : (
                      <>
                        <Eye size={14} /> Preview
                      </>
                    )}
                  </button>
                </div>

                {isPreview ? (
                  <div
                    className="markdown-preview"
                    style={{
                      padding: "12px",
                      background: "var(--bg-secondary)",
                      borderRadius: "var(--radius-sm)",
                      minHeight: "114px",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {description ? (
                      <ReactMarkdown>{description}</ReactMarkdown>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>
                        No description provided.
                      </span>
                    )}
                  </div>
                ) : (
                  <textarea
                    id="task-description"
                    rows={5}
                    placeholder="Describe the task using markdown..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                  />
                )}
              </div>

              <div className="form-group">
                <label>
                  <CheckSquare
                    size={16}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />{" "}
                  Subtasks
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  {subtasks.map((st, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "var(--bg-secondary)",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={st.is_completed}
                          onChange={() => toggleSubtask(index)}
                          style={{
                            width: "16px",
                            height: "16px",
                            accentColor: "var(--primary)",
                            cursor: "pointer",
                          }}
                        />
                        <span
                          style={{
                            color: st.is_completed
                              ? "var(--text-muted)"
                              : "var(--text-primary)",
                            textDecoration: st.is_completed
                              ? "line-through"
                              : "none",
                            fontSize: "14px",
                          }}
                        >
                          {st.title}
                        </span>
                      </div>
                      <Trash2
                        size={16}
                        color="var(--danger)"
                        style={{ cursor: "pointer" }}
                        onClick={() => removeSubtask(index)}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Add a subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={handleAddSubtask}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    style={{
                      padding: "0 16px",
                      background: "var(--primary)",
                      color: "white",
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="HIGH">🔥 High Priority</option>
                    <option value="MEDIUM">🟡 Medium Priority</option>
                    <option value="LOW">🟢 Low Priority</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="task-deadline">
                    <CalendarDays
                      size={16}
                      style={{ marginRight: 6, verticalAlign: "middle" }}
                    />{" "}
                    Deadline
                  </label>
                  <input
                    id="task-deadline"
                    type="date"
                    value={deadline || ""}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div className="task-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-task-btn"
                  disabled={!title.trim()}
                >
                  {editingId ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TaskModal;
