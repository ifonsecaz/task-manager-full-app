import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateItem } from './CartSlice';

const priorities = ["Low", "Medium", "High"];
const statuses = ["Pending", "In Progress", "Completed"];

const TodoList = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.cart.items);

    const [search, setSearch] = useState("");
    const [orderBy, setOrderBy] = useState("");
    const [editTask, setEditTask] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        status: "",
        priority: "",
        dueDate: "",
    });

    useEffect(() => {

    }, [tasks]);

    // Filter and sort tasks
    const filteredTasks = tasks
        .filter(
            (task) =>
                task.action !== "delete" &&
                task.title.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (orderBy === "priority") {
                return (
                    priorities.indexOf(b.priority) - priorities.indexOf(a.priority)
                );
            }
            if (orderBy === "dueDate") {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            if (orderBy === "status") {
                return statuses.indexOf(a.status) - statuses.indexOf(b.status);
            }
            return 0;
        });

    const handleStatusCheckbox = (task) => {
        if (task.status !== "Completed") {
            dispatch(
                updateItem({
                    ...task,
                    status: "Completed",
                })
            );
        }
        else{
            dispatch(
                updateItem({
                    ...task,
                    status: "In Progress",
                })
            );
        }
    };


    // Handle edit
    const handleEdit = (task) => {
        setEditTask(task.task_id);
        setEditForm({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        dispatch(
            updateItem({
                task_id: editTask,
                title: editForm.title,
                description: editForm.description,
                status: editForm.status,
                priority: editForm.priority,
                createdDate: editForm.createdDate, // if you have it
                dueDate: editForm.dueDate ? new Date(editForm.dueDate).toISOString() : new Date().toISOString,
            })
        );
        setEditTask(null);
    };

    return (
        <div style={{ position: "relative" }}>
            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginRight: 8 }}
                />
                <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
                    <option value="">Order By</option>
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due Date</option>
                    <option value="status">Status</option>
                </select>
            </div>

            {/* Edit Form Overlay */}
            {editTask && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.4)",
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <form
                        onSubmit={handleEditSubmit}
                        style={{
                            background: "#fff",
                            padding: 24,
                            borderRadius: 8,
                            minWidth: 320,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                    >
                        <h3>Edit Task</h3>
                        <div>
                            <label>Title:</label>
                            <input
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Status:</label>
                            <select
                                name="status"
                                value={editForm.status}
                                onChange={handleEditChange}
                                required
                            >
                                {statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Priority:</label>
                            <select
                                name="priority"
                                value={editForm.priority}
                                onChange={handleEditChange}
                                required
                            >
                                {priorities.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Due Date:</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={editForm.dueDate}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <button type="submit">Save</button>
                            <button
                                type="button"
                                onClick={() => setEditTask(null)}
                                style={{ marginLeft: 8 }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Cards */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    opacity: editTask ? 0.3 : 1,
                    pointerEvents: editTask ? "none" : "auto",
                }}
            >
                {filteredTasks.map((task) => (
                    <div
                        key={task.task_id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            padding: 16,
                            width: 280,
                            background: "#fafafa",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            position: "relative",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                            <input
                                type="checkbox"
                                checked={task.status === "Completed"}
                                onChange={() => handleStatusCheckbox(task)}
                                style={{ marginRight: 8 }}
                            />
                            <h4 style={{ margin: 0 }}>{task.title}</h4>
                        </div>
                        <p>{task.description}</p>
                        <div>
                            <strong>Status:</strong> {task.status}
                        </div>
                        <div>
                            <strong>Priority:</strong> {task.priority}
                        </div>
                        <div>
                            <strong>Created:</strong> {task.createdDate ? task.createdDate.slice(0, 10):''}
                        </div>
                        <div>
                            <strong>Due:</strong> {task.dueDate ? task.dueDate.slice(0, 10):''}
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <button onClick={() => handleEdit(task)}>Edit</button>
                            <button
                                onClick={() => dispatch(removeItem({"task_id":task.task_id}))}
                                style={{ marginLeft: 8 }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {filteredTasks.length === 0 && (
                    <div style={{ margin: 32, color: "#888" }}>No tasks found.</div>
                )}
            </div>
        </div>
    );
};

export default TodoList;