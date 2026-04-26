const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};
    if (filter === 'active') query.completed = false;
    if (filter === 'completed') query.completed = true;
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title required" });
    const task = await Task.create({ 
      title: title.trim(), 
      description: description?.trim() || '' 
    });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Create failed" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };