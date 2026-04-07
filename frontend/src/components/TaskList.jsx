function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task._id}>
          <strong>{task.title}</strong> - {task.description}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;