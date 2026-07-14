import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, X, CalendarDays } from "lucide-react";

function TaskModal({
    show,
    editingId,
    title,
    description,
    priority,
    deadline,
    setTitle,
    setDescription,
    setPriority,
    setDeadline,
    saveTask,
    closeModal,
}) {
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
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9,
                            y: 30,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
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
                                {editingId ? (
                                    <Pencil size={22} />
                                ) : (
                                    <Plus size={22} />
                                )}
                            </div>

                            <div>
                                <h2>
                                    {editingId
                                        ? "Edit Task"
                                        : "Create Task"}
                                </h2>

                                <p>
                                    {editingId
                                        ? "Update your task information."
                                        : "Create a new task for your workflow."}
                                </p>
                            </div>
                        </div>

                        <form
                            className="task-form"
                            onSubmit={saveTask}
                        >
                            <div className="form-group">
                                <label htmlFor="task-title">
                                    Task Title
                                </label>

                                <input
                                    id="task-title"
                                    type="text"
                                    placeholder="Enter task title"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    maxLength={100}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="task-description">
                                    Description
                                </label>

                                <textarea
                                    id="task-description"
                                    rows={5}
                                    placeholder="Describe the task..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    maxLength={1000}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="task-priority">
                                    Priority
                                </label>

                                <select
                                    id="task-priority"
                                    value={priority}
                                    onChange={(e) =>
                                        setPriority(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="HIGH">
                                        🔥 High Priority
                                    </option>

                                    <option value="MEDIUM">
                                        🟡 Medium Priority
                                    </option>

                                    <option value="LOW">
                                        🟢 Low Priority
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="task-deadline">
                                    <CalendarDays
                                        size={16}
                                        style={{
                                            marginRight: 6,
                                            verticalAlign:
                                                "middle",
                                        }}
                                    />
                                    Deadline
                                </label>

                                <input
                                    id="task-deadline"
                                    type="date"
                                    value={deadline || ""}
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={(e) =>
                                        setDeadline(
                                            e.target.value
                                        )
                                    }
                                />
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
                                    {editingId
                                        ? "Update Task"
                                        : "Create Task"}
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