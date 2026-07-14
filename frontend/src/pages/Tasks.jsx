import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import API from "../api/axios";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { useToast } from "../context/ToastContext";

import {
    Plus,
    Flame,
    Minus,
    Leaf,
    CheckCircle,
    Search,
    ArrowUpDown,
    Filter,
} from "lucide-react";

import "../styles/tasks.css";

function Tasks() {

    const { showToast } = useToast();

    /* ==========================================
       STATE
    ========================================== */

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("LOW");
    const [deadline, setDeadline] = useState("");

    const [search, setSearch] = useState("");
    const [filterPriority, setFilterPriority] = useState("ALL");
    const [sortBy, setSortBy] = useState("NEWEST");

    /* ==========================================
       LOAD TASKS
    ========================================== */

    const fetchTasks = useCallback(async () => {

        try {

            setLoading(true);

            const { data } = await API.get("/tasks");

            setTasks(data);

        } catch (error) {

            console.error(error);

            showToast(
                "Failed to load tasks",
                "error"
            );

        } finally {

            setLoading(false);

        }

    }, [showToast]);

    useEffect(() => {

        fetchTasks();

    }, [fetchTasks]);

    /* ==========================================
       FORM HELPERS
    ========================================== */

    const resetForm = () => {

        setTitle("");
        setDescription("");
        setPriority("LOW");
        setDeadline("");
        setEditingId(null);

    };

    const openCreateModal = () => {

        resetForm();
        setShowModal(true);

    };

    const closeModal = () => {

        resetForm();
        setShowModal(false);

    };

    /* ==========================================
       SAVE TASK
    ========================================== */

    const saveTask = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await API.put(
                    `/tasks/${editingId}`,
                    {
                        title,
                        description,
                        priority,
                        deadline,
                    }
                );

                showToast(
                    "Task updated successfully ✏️",
                    "success"
                );

            } else {

                await API.post(
                    "/tasks",
                    {
                        title,
                        description,
                        priority,
                        deadline,
                    }
                );

                showToast(
                    "Task created successfully 🚀",
                    "success"
                );

            }

            closeModal();

            fetchTasks();

        } catch (error) {

            console.error(error);

            showToast(
                "Unable to save task",
                "error"
            );

        }

    };

    /* ==========================================
       EDIT TASK
    ========================================== */

    const editTask = (task) => {

        setEditingId(task.id);

        setTitle(task.title || "");

        setDescription(task.description || "");

        setPriority(task.priority || "LOW");

        setDeadline(
            task.deadline
                ? task.deadline.slice(0, 10)
                : ""
        );

        setShowModal(true);

    };

    /* ==========================================
       DELETE TASK
    ========================================== */

    const deleteTask = async (id) => {

        try {

            await API.delete(`/tasks/${id}`);

            showToast(
                "Task deleted successfully 🗑️",
                "success"
            );

            fetchTasks();

        } catch (error) {

            console.error(error);

            showToast(
                "Unable to delete task",
                "error"
            );

        }

    };

    /* ==========================================
       COMPLETE TASK
    ========================================== */

    const completeTask = async (id) => {

        try {

            await API.patch(
                `/tasks/${id}/complete`
            );

            showToast(
                "Task completed ✅",
                "success"
            );

            fetchTasks();

        } catch (error) {

            console.error(error);

            showToast(
                "Unable to complete task",
                "error"
            );

        }

    };

    /* ==========================================
       FILTER + SEARCH + SORT
    ========================================== */

    const filteredTasks = useMemo(() => {

        let list = [...tasks];

        if (search.trim()) {

            const keyword = search.toLowerCase();

            list = list.filter((task) =>

                task.title
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                task.description
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                task.priority
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                task.deadline
                    ?.includes(keyword)

            );

        }

        if (filterPriority !== "ALL") {

            list = list.filter(

                (task) =>
                    task.priority ===
                    filterPriority

            );

        }

        switch (sortBy) {

            case "ALPHABETICAL":

                list.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );

                break;

            case "PRIORITY": {

                const order = {

                    HIGH: 1,
                    MEDIUM: 2,
                    LOW: 3,

                };

                list.sort(

                    (a, b) =>
                        order[a.priority] -
                        order[b.priority]

                );

                break;

            }

            case "OLDEST":

                list.sort(

                    (a, b) =>
                        new Date(a.created_at) -
                        new Date(b.created_at)

                );

                break;

            case "NEWEST":
            default:

                list.sort(

                    (a, b) =>
                        new Date(b.created_at) -
                        new Date(a.created_at)

                );

        }

        return list;

    }, [

        tasks,
        search,
        filterPriority,
        sortBy,

    ]);

    /* ==========================================
       COLUMN DATA
    ========================================== */

    const highTasks = filteredTasks.filter(

        (task) =>
            task.priority === "HIGH" &&
            !task.completed

    );

    const mediumTasks = filteredTasks.filter(

        (task) =>
            task.priority === "MEDIUM" &&
            !task.completed

    );

    const lowTasks = filteredTasks.filter(

        (task) =>
            task.priority === "LOW" &&
            !task.completed

    );

    const completedTasks = filteredTasks.filter(

        (task) => task.completed

    );    
    /* ==========================================
       RENDER TASKS
    ========================================== */

    const renderTasks = (list, type) => {

        if (!list.length) {

            const messages = {
                HIGH: "🔥 No high priority tasks",
                MEDIUM: "🟡 Nothing in progress",
                LOW: "🍃 Low priority queue is clear",
                COMPLETED: "✅ Complete a task to see it here",
            };

            return (
                <div className="empty-column">
                    <p>{messages[type]}</p>
                </div>
            );

        }

        return list.map((task) => (

            <TaskCard
                key={task.id}
                task={task}
                editTask={editTask}
                deleteTask={deleteTask}
                completeTask={completeTask}
            />

        ));

    };

    /* ==========================================
       COLUMN HEADER
    ========================================== */

    const ColumnHeader = ({
        icon,
        title,
        count,
    }) => (

        <div className="column-header">

            <div className="column-title">

                {icon}

                <div>

                    <h2>{title}</h2>

                    <p>
                        {count} Task
                        {count !== 1 ? "s" : ""}
                    </p>

                </div>

            </div>

            <span>{count}</span>

        </div>

    );

    /* ==========================================
       PAGE
    ========================================== */

    return (

        <div className="tasks-container">

            {/* ================= HEADER ================= */}

            <motion.section
                className="tasks-header glass-card"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >

                <div>

                    <h1>My Tasks 🚀</h1>

                    <p>
                        Organize, prioritize and complete your workflow with ease.
                    </p>

                </div>

                <button
                    className="create-task-btn"
                    onClick={openCreateModal}
                >

                    <Plus size={18} />

                    Create Task

                </button>

            </motion.section>

            {/* ================= TOOLBAR ================= */}

            <motion.div
                className="task-toolbar glass-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
            >

                <div className="toolbar-search">

                    <div className="search-icon">
                        <Search size={18} />
                    </div>

                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <div className="toolbar-controls">

                    <div className="toolbar-select">

                        <Filter size={16} />

                        <select
                            value={filterPriority}
                            onChange={(e) =>
                                setFilterPriority(e.target.value)
                            }
                        >

                            <option value="ALL">
                                All Priorities
                            </option>

                            <option value="HIGH">
                                High
                            </option>

                            <option value="MEDIUM">
                                Medium
                            </option>

                            <option value="LOW">
                                Low
                            </option>

                        </select>

                    </div>

                    <div className="toolbar-select">

                        <ArrowUpDown size={16} />

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value)
                            }
                        >

                            <option value="NEWEST">
                                Newest
                            </option>

                            <option value="OLDEST">
                                Oldest
                            </option>

                            <option value="ALPHABETICAL">
                                A-Z
                            </option>

                            <option value="PRIORITY">
                                Priority
                            </option>

                        </select>

                    </div>

                </div>

            </motion.div>

            {/* ================= CONTENT ================= */}

            {loading ? (

                <div className="tasks-loading">

                    <h2>
                        Loading your workspace...
                    </h2>

                </div>

            ) : (

                <motion.div
                    className="task-board"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >

                    {/* HIGH */}

                    <div className="task-column high-column">

                        <ColumnHeader
                            icon={<Flame size={22} />}
                            title="HIGH"
                            count={highTasks.length}
                        />

                        <div className="column-content">

                            {renderTasks(
                                highTasks,
                                "HIGH"
                            )}

                        </div>

                    </div>

                    {/* MEDIUM */}

                    <div className="task-column medium-column">

                        <ColumnHeader
                            icon={<Minus size={22} />}
                            title="MEDIUM"
                            count={mediumTasks.length}
                        />

                        <div className="column-content">

                            {renderTasks(
                                mediumTasks,
                                "MEDIUM"
                            )}

                        </div>

                    </div>

                    {/* LOW */}

                    <div className="task-column low-column">

                        <ColumnHeader
                            icon={<Leaf size={22} />}
                            title="LOW"
                            count={lowTasks.length}
                        />

                        <div className="column-content">

                            {renderTasks(
                                lowTasks,
                                "LOW"
                            )}

                        </div>

                    </div>

                    {/* COMPLETED */}

                    <div className="task-column completed-column">

                        <ColumnHeader
                            icon={
                                <CheckCircle size={22} />
                            }
                            title="COMPLETED"
                            count={completedTasks.length}
                        />

                        <div className="column-content">

                            {renderTasks(
                                completedTasks,
                                "COMPLETED"
                            )}

                        </div>

                    </div>

                </motion.div>

            )}

            {/* ================= MODAL ================= */}

            <TaskModal
                show={showModal}
                editingId={editingId}
                title={title}
                description={description}
                priority={priority}
                deadline={deadline}
                setTitle={setTitle}
                setDescription={setDescription}
                setPriority={setPriority}
                setDeadline={setDeadline}
                saveTask={saveTask}
                closeModal={closeModal}
            />

        </div>

    );

}

export default Tasks;