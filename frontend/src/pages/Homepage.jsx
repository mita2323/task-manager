import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { getTasks, createTask } from "../services/taskService";

function HomePage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (taskData) => {
    const newTask = await createTask(taskData);
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  return (
    <div>
      <TaskForm onAddTask={handleAddTask} />
      <TaskList tasks={tasks} />
    </div>
  );
}

export default HomePage;