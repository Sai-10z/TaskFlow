import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import PriorityBadge from "./PriorityBadge";

import {
    CheckCircle2,
    Edit3,
    Trash2,
    CalendarDays,
    Clock3,
    FileText,
    Eye,
    X,
    AlertTriangle,
} from "lucide-react";

function TaskCard({
    task,
    editTask,
    deleteTask,
    completeTask,
}) {
    const [showDetails, setShowDetails] = useState(false);

    const cardType = task.completed
        ? "completed"
        : task.priority?.toLowerCase();

    const createdDate = useMemo(() => {
        if (!task.created_at) return "Unknown";

        return new Date(task.created_at).toLocaleString();
    }, [task.created_at]);

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

    const shortDescription =
        task.description?.length > 100
            ? `${task.description.slice(0, 100)}...`
            : task.description || "No description provided.";

    return (
        <>
            <motion.div
                layout
                className={`task-card ${cardType}`}
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                whileHover={{
                    y: -6,
                    scale: 1.01,
                }}
                transition={{
                    duration: 0.25,
                }}
            >
                <div className="task-main">

                    <div className="task-title-row">

                        <h2>{task.title}</h2>

                        <PriorityBadge
                            priority={
                                task.completed
                                    ? "COMPLETED"
                                    : task.priority
                            }
                        />

                    </div>

                    <p className="task-description-preview">
                        {shortDescription}
                    </p>

                    {task.deadline && (
                        <div className="created-date">

                            <CalendarDays size={15} />

                            <span>
                                Due:{" "}
                                {new Date(
                                    task.deadline
                                ).toLocaleDateString()}
                            </span>

                            {isOverdue && (
                                <span className="overdue-badge">
                                    <AlertTriangle size={13} />
                                    Overdue
                                </span>
                            )}

                        </div>
                    )}

                    <div className="task-bottom-row">

                        <div className="task-status">

                            {task.completed ? (
                                <>
                                    <CheckCircle2 size={15} />
                                    Completed
                                </>
                            ) : (
                                <>
                                    <Clock3 size={15} />
                                    Pending
                                </>
                            )}

                        </div>

                        <button
                            type="button"
                            className="details-button"
                            onClick={() =>
                                setShowDetails(true)
                            }
                            aria-label="View task"
                        >
                            <Eye size={18} />
                        </button>

                    </div>

                </div>
            </motion.div>

            <AnimatePresence>

                {showDetails && (

                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() =>
                            setShowDetails(false)
                        }
                    >

                        <motion.div
                            className="task-popup glass-card"
                            initial={{
                                scale: 0.9,
                                opacity: 0,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}
                            exit={{
                                scale: 0.9,
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <button
                                type="button"
                                className="close-modal"
                                onClick={() =>
                                    setShowDetails(false)
                                }
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>

                            <h2>{task.title}</h2>

                            <br />

                            <PriorityBadge
                                priority={
                                    task.completed
                                        ? "COMPLETED"
                                        : task.priority
                                }
                            />

                            <br />

                            <div className="popup-item">

                                <FileText size={18} />

                                <div>

                                    <strong>Description</strong>

                                    <p>
                                        {task.description ||
                                            "No description provided."}
                                    </p>

                                </div>

                            </div>

                            <br />

                            <div className="popup-item">

                                <CalendarDays size={18} />

                                <div>

                                    <strong>Created</strong>

                                    <p>{createdDate}</p>

                                </div>

                            </div>

                            {task.deadline && (
                                <>
                                    <br />

                                    <div className="popup-item">

                                        <CalendarDays size={18} />

                                        <div>

                                            <strong>
                                                Deadline
                                            </strong>

                                            <p>
                                                {new Date(
                                                    task.deadline
                                                ).toLocaleDateString()}
                                            </p>

                                        </div>

                                    </div>
                                </>
                            )}

                            {isOverdue && (
                                <>
                                    <br />

                                    <div className="overdue-message">
                                        ⚠ This task is overdue.
                                    </div>
                                </>
                            )}

                            <div className="task-actions">

                                {!task.completed && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowDetails(false);
                                            completeTask(task.id);
                                        }}
                                    >
                                        <CheckCircle2
                                            size={16}
                                        />
                                        Complete
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDetails(false);
                                        editTask(task);
                                    }}
                                >
                                    <Edit3 size={16} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="delete-action"
                                    onClick={() => {
                                        setShowDetails(false);
                                        deleteTask(task.id);
                                    }}
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>

                            </div>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>
        </>
    );
}

export default TaskCard;