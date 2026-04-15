import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";
import "../App.css";

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      const data = await getTasks(filter);
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleAdd = async (data) => {
    try {
      const newTask = await createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleToggle = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    try {
      const updated = await updateTask(id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setError("");
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  return (
    <main className="page">
      <section className="app-shell">
        <div className="app-header">
          <div className="title-block">
            <h1 className="app-title">Task Manager</h1>
            <p className="app-subtitle">
              Create, track and manage your tasks.
            </p>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <TaskForm onAddTask={handleAdd} />

        <div className="list-panel">
          <div className="filter-group">
            <label htmlFor="filter">Filter tasks</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </div>
      </section>
    </main>
  );
}

export default HomePage;