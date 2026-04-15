function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li className="task-card" key={task._id}>
          <div className="task-top">
            <label className="task-check">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task._id)}
              />
              <span
                className={task.completed ? "task-title completed" : "task-title"}
              >
                {task.title}
              </span>
            </label>

            <button
              className="delete-button"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <span className={task.completed ? "status done" : "status active"}>
            {task.completed ? "Completed" : "Active"}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;