const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const Task = require("../models/Task");

jest.mock("../models/Task");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("taskController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    test("ska returnera alla tasks utan filter", async () => {
      const req = {
        query: {}
      };
      const res = mockResponse();

      const mockTasks = [
        { title: "Task 1", completed: false },
        { title: "Task 2", completed: true }
      ];

      const sortMock = jest.fn().mockResolvedValue(mockTasks);
      Task.find.mockReturnValue({ sort: sortMock });

      await getTasks(req, res);

      expect(Task.find).toHaveBeenCalledWith({});
      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    test("ska filtrera aktiva tasks", async () => {
      const req = {
        query: { filter: "active" }
      };
      const res = mockResponse();

      const mockTasks = [{ title: "Task 1", completed: false }];

      const sortMock = jest.fn().mockResolvedValue(mockTasks);
      Task.find.mockReturnValue({ sort: sortMock });

      await getTasks(req, res);

      expect(Task.find).toHaveBeenCalledWith({ completed: false });
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    test("ska filtrera completed tasks", async () => {
      const req = {
        query: { filter: "completed" }
      };
      const res = mockResponse();

      const mockTasks = [{ title: "Task 2", completed: true }];

      const sortMock = jest.fn().mockResolvedValue(mockTasks);
      Task.find.mockReturnValue({ sort: sortMock });

      await getTasks(req, res);

      expect(Task.find).toHaveBeenCalledWith({ completed: true });
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    test("ska returnera status 500 om hämtning misslyckas", async () => {
      const req = {
        query: {}
      };
      const res = mockResponse();

      const sortMock = jest.fn().mockRejectedValue(new Error("Database error"));
      Task.find.mockReturnValue({ sort: sortMock });

      await getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to fetch tasks" });
    });
  });

  describe("createTask", () => {
    test("ska skapa en task med trimmad title och description", async () => {
      const req = {
        body: {
          title: "  Ny task  ",
          description: "  Beskrivning  "
        }
      };
      const res = mockResponse();

      const createdTask = {
        _id: "123",
        title: "Ny task",
        description: "Beskrivning"
      };

      Task.create.mockResolvedValue(createdTask);

      await createTask(req, res);

      expect(Task.create).toHaveBeenCalledWith({
        title: "Ny task",
        description: "Beskrivning"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTask);
    });

    test("ska returnera 400 om title saknas", async () => {
      const req = {
        body: {
          title: "",
          description: "Test"
        }
      };
      const res = mockResponse();

      await createTask(req, res);

      expect(Task.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Title required" });
    });

    test("ska sätta tom description om description saknas", async () => {
      const req = {
        body: {
          title: "Task utan beskrivning"
        }
      };
      const res = mockResponse();

      const createdTask = {
        _id: "456",
        title: "Task utan beskrivning",
        description: ""
      };

      Task.create.mockResolvedValue(createdTask);

      await createTask(req, res);

      expect(Task.create).toHaveBeenCalledWith({
        title: "Task utan beskrivning",
        description: ""
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test("ska returnera 500 om create misslyckas", async () => {
      const req = {
        body: {
          title: "Test task",
          description: "Test"
        }
      };
      const res = mockResponse();

      Task.create.mockRejectedValue(new Error("Database error"));

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Create failed" });
    });
  });

  describe("updateTask", () => {
    test("ska uppdatera en task", async () => {
      const req = {
        params: { id: "123" },
        body: { title: "Uppdaterad task", completed: true }
      };
      const res = mockResponse();

      const updatedTask = {
        _id: "123",
        title: "Uppdaterad task",
        completed: true
      };

      Task.findByIdAndUpdate.mockResolvedValue(updatedTask);

      await updateTask(req, res);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { title: "Uppdaterad task", completed: true },
        { new: true, runValidators: true }
      );
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    test("ska returnera 404 om task inte hittas vid uppdatering", async () => {
      const req = {
        params: { id: "123" },
        body: { title: "Uppdaterad task" }
      };
      const res = mockResponse();

      Task.findByIdAndUpdate.mockResolvedValue(null);

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    test("ska returnera 500 om update misslyckas", async () => {
      const req = {
        params: { id: "123" },
        body: { title: "Uppdaterad task" }
      };
      const res = mockResponse();

      Task.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Update failed" });
    });
  });

  describe("deleteTask", () => {
    test("ska radera en task", async () => {
      const req = {
        params: { id: "123" }
      };
      const res = mockResponse();

      Task.findByIdAndDelete.mockResolvedValue({ _id: "123" });

      await deleteTask(req, res);

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith({ message: "Deleted" });
    });

    test("ska returnera 404 om task inte hittas vid borttagning", async () => {
      const req = {
        params: { id: "123" }
      };
      const res = mockResponse();

      Task.findByIdAndDelete.mockResolvedValue(null);

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    test("ska returnera 500 om delete misslyckas", async () => {
      const req = {
        params: { id: "123" }
      };
      const res = mockResponse();

      Task.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Delete failed" });
    });
  });
});