import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect } from "vitest";
import TaskForm from "../components/TaskForm";

describe("TaskForm", () => {
  describe("rendering", () => {
    test("ska rendera titelinput, beskrivningsfält och submit-knapp", () => {
      render(<TaskForm onAddTask={vi.fn()} />);

      expect(screen.getByLabelText("Title")).toBeInTheDocument();
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Add task" })
      ).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    test("ska anropa onAddTask med trimmad titel och beskrivning", async () => {
      const user = userEvent.setup();
      const onAddTask = vi.fn();

      render(<TaskForm onAddTask={onAddTask} />);

      await user.type(screen.getByLabelText("Title"), "  New task  ");
      await user.type(
        screen.getByLabelText("Description"),
        "  My description  "
      );
      await user.click(screen.getByRole("button", { name: "Add task" }));

      expect(onAddTask).toHaveBeenCalledTimes(1);
      expect(onAddTask).toHaveBeenCalledWith({
        title: "New task",
        description: "My description",
      });
    });

    test("ska inte anropa onAddTask när titel saknas", async () => {
      const user = userEvent.setup();
      const onAddTask = vi.fn();

      render(<TaskForm onAddTask={onAddTask} />);

      await user.type(
        screen.getByLabelText("Description"),
        "Only description"
      );
      await user.click(screen.getByRole("button", { name: "Add task" }));

      expect(onAddTask).not.toHaveBeenCalled();
    });

    test("ska rensa formuläret efter lyckad submit", async () => {
      const user = userEvent.setup();
      const onAddTask = vi.fn();

      render(<TaskForm onAddTask={onAddTask} />);

      const titleInput = screen.getByLabelText("Title");
      const descriptionInput = screen.getByLabelText("Description");

      await user.type(titleInput, "Task title");
      await user.type(descriptionInput, "Task description");
      await user.click(screen.getByRole("button", { name: "Add task" }));

      expect(titleInput).toHaveValue("");
      expect(descriptionInput).toHaveValue("");
    });
  });
});