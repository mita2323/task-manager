import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, beforeEach } from "vitest";
import HomePage from "../pages/Homepage";
import * as taskService from "../services/taskService";

let capturedOnToggle;

vi.mock("../components/TaskList", () => ({
  default: ({ tasks, onToggle, onDelete }) => {
    capturedOnToggle = onToggle;
    if (!tasks.length) return <p>No tasks yet.</p>;
    return (
      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            <span>{t.title}</span>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => onToggle(t._id)}
            />
            {t.completed && <span>Completed</span>}
            <button onClick={() => onDelete(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    );
  },
}));

vi.mock("../services/taskService", () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchTasks", () => {
    test("ska hämta och visa tasks vid laddning", async () => {
      taskService.getTasks.mockResolvedValue([
        {
          _id: "1",
          title: "Task one",
          description: "Desc one",
          completed: false,
        },
        {
          _id: "2",
          title: "Task two",
          description: "Desc two",
          completed: true,
        },
      ]);

      render(<HomePage />);

      expect(taskService.getTasks).toHaveBeenCalledWith("all");

      expect(await screen.findByText("Task one")).toBeInTheDocument();
      expect(screen.getByText("Task two")).toBeInTheDocument();
    });

    test("ska visa felmeddelande om hämtning misslyckas", async () => {
      taskService.getTasks.mockRejectedValue(new Error("Load failed"));

      render(<HomePage />);

      expect(
        await screen.findByText("Failed to load tasks")
      ).toBeInTheDocument();
    });

    test("ska uppdatera filter och hämta filtrerade tasks", async () => {
      const user = userEvent.setup();

      taskService.getTasks
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          {
            _id: "1",
            title: "Active task",
            description: "",
            completed: false,
          },
        ]);

      render(<HomePage />);

      await screen.findByText("No tasks yet.");

      await user.selectOptions(screen.getByLabelText("Filter tasks"), "active");

      await waitFor(() => {
        expect(taskService.getTasks).toHaveBeenLastCalledWith("active");
      });
    });
  });

  describe("handleAdd", () => {
    test("ska skapa en ny task när formuläret skickas", async () => {
      const user = userEvent.setup();

      taskService.getTasks.mockResolvedValue([]);
      taskService.createTask.mockResolvedValue({
        _id: "3",
        title: "New task",
        description: "New description",
        completed: false,
      });

      render(<HomePage />);

      await screen.findByText("No tasks yet.");

      await user.type(screen.getByLabelText("Title"), "New task");
      await user.type(screen.getByLabelText("Description"), "New description");
      await user.click(screen.getByRole("button", { name: "Add task" }));

      await waitFor(() => {
        expect(taskService.createTask).toHaveBeenCalledWith({
          title: "New task",
          description: "New description",
        });
      });

      expect(await screen.findByText("New task")).toBeInTheDocument();
    });

    test("ska visa API-felmeddelande om skapande misslyckas", async () => {
      const user = userEvent.setup();

      taskService.getTasks.mockResolvedValue([]);
      taskService.createTask.mockRejectedValue({
        response: {
          data: {
            message: "Failed to create task from API",
          },
        },
      });

      render(<HomePage />);

      await screen.findByText("No tasks yet.");

      await user.type(screen.getByLabelText("Title"), "New task");
      await user.type(screen.getByLabelText("Description"), "New description");
      await user.click(screen.getByRole("button", { name: "Add task" }));

      expect(
        await screen.findByText("Failed to create task from API")
      ).toBeInTheDocument();
    });

    test("ska visa standardfelmeddelande om API-felmeddelande saknas", async () => {
      const user = userEvent.setup();

      taskService.getTasks.mockResolvedValue([]);
      taskService.createTask.mockRejectedValue(new Error("Create failed"));

      render(<HomePage />);

      await screen.findByText("No tasks yet.");

      await user.type(screen.getByLabelText("Title"), "New task");
      await user.type(screen.getByLabelText("Description"), "New description");
      await user.click(screen.getByRole("button", { name: "Add task" }));

      expect(
        await screen.findByText("Failed to create task")
      ).toBeInTheDocument();
    });
  });

  describe("handleToggle", () => {
    test("ska uppdatera en task när checkboxen klickas", async () => {
      const user = userEvent.setup();

      taskService.getTasks.mockResolvedValue([
        { _id: "1", title: "Task one", description: "", completed: false },
        { _id: "2", title: "Task two", description: "", completed: false },
      ]);

      taskService.updateTask.mockResolvedValue({
        _id: "1",
        title: "Task one",
        description: "",
        completed: true,
      });

      render(<HomePage />);

      await screen.findByText("Task one");

      await user.click(screen.getAllByRole("checkbox")[0]);

      await waitFor(() => {
        expect(taskService.updateTask).toHaveBeenCalledWith("1", {
          completed: true,
        });
      });

      expect(
        await screen.findByText((content, element) => {
          return (
            element?.tagName.toLowerCase() === "span" && content === "Completed"
          );
        })
      ).toBeInTheDocument();
    });

    test("ska visa felmeddelande om uppdatering misslyckas", async () => {
      const user = userEvent.setup();

      taskService.getTasks.mockResolvedValue([
        {
          _id: "1",
          title: "Task one",
          description: "",
          completed: false,
        },
      ]);

      taskService.updateTask.mockRejectedValue(new Error("Update failed"));

      render(<HomePage />);

      await screen.findByText("Task one");

      await user.click(screen.getByRole("checkbox"));

      expect(
        await screen.findByText("Failed to update task")
      ).toBeInTheDocument();
    });

    test("ska inte uppdatera om task inte hittas", async () => {
      taskService.getTasks.mockResolvedValue([
        { _id: "1", title: "Task one", description: "", completed: false },
      ]);

      render(<HomePage />);
      await screen.findByText("Task one");

      await act(async () => {
        await capturedOnToggle("nonexistent-id");
      });

      expect(taskService.updateTask).not.toHaveBeenCalled();
      expect(screen.getByText("Task one")).toBeInTheDocument();
    });
  });

  describe("handleDelete", () => {
    test("ska radera en task när delete-knappen klickas", async () => {
      const user = userEvent.setup();

      taskService.getTasks.mockResolvedValue([
        {
          _id: "1",
          title: "Task one",
          description: "",
          completed: false,
        },
      ]);

      taskService.deleteTask.mockResolvedValue({});

      render(<HomePage />);

      await screen.findByText("Task one");

      await user.click(screen.getByRole("button", { name: "Delete" }));

      await waitFor(() => {
        expect(taskService.deleteTask).toHaveBeenCalledWith("1");
      });

      expect(screen.queryByText("Task one")).not.toBeInTheDocument();
    });

    test("ska visa felmeddelande om borttagning misslyckas", async () => {
      const user = userEvent.setup();

      taskService.getTasks.mockResolvedValue([
        {
          _id: "1",
          title: "Task one",
          description: "",
          completed: false,
        },
      ]);

      taskService.deleteTask.mockRejectedValue(new Error("Delete failed"));

      render(<HomePage />);

      await screen.findByText("Task one");

      await user.click(screen.getByRole("button", { name: "Delete" }));

      expect(
        await screen.findByText("Failed to delete task")
      ).toBeInTheDocument();

      expect(screen.getByText("Task one")).toBeInTheDocument();
    });
  });
});
