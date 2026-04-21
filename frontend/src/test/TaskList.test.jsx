import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect } from "vitest";
import TaskList from "../components/TaskList";

describe("TaskList", () => {
  describe("render", () => {
    test("ska visa tomt meddelande när inga tasks finns", () => {
      render(<TaskList tasks={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

      expect(screen.getByText("No tasks yet.")).toBeInTheDocument();
    });

    test("ska rendera tasks med titel, beskrivning och status", () => {
      const tasks = [
        {
          _id: "1",
          title: "Task one",
          description: "First description",
          completed: false,
        },
        {
          _id: "2",
          title: "Task two",
          description: "Second description",
          completed: true,
        },
      ];

      render(
        <TaskList tasks={tasks} onToggle={vi.fn()} onDelete={vi.fn()} />
      );

      expect(screen.getByText("Task one")).toBeInTheDocument();
      expect(screen.getByText("First description")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();

      expect(screen.getByText("Task two")).toBeInTheDocument();
      expect(screen.getByText("Second description")).toBeInTheDocument();
      expect(screen.getByText("Completed")).toBeInTheDocument();
    });
  });

  describe("interaktion", () => {
    test("ska anropa onToggle när checkbox klickas", async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      const tasks = [
        {
          _id: "1",
          title: "Task one",
          description: "",
          completed: false,
        },
      ];

      render(
        <TaskList tasks={tasks} onToggle={onToggle} onDelete={vi.fn()} />
      );

      await user.click(screen.getByRole("checkbox"));

      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith("1");
    });

    test("ska anropa onDelete när delete-knappen klickas", async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      const tasks = [
        {
          _id: "1",
          title: "Task one",
          description: "",
          completed: false,
        },
      ];

      render(
        <TaskList tasks={tasks} onToggle={vi.fn()} onDelete={onDelete} />
      );

      await user.click(screen.getByRole("button", { name: "Delete" }));

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith("1");
    });
  });
});
