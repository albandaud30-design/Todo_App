
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

let tasks = [];

try {
  const savedTasks = JSON.parse(localStorage.getItem("todoTasks"));
  if (Array.isArray(savedTasks)) {
    tasks = savedTasks.filter(
      task =>
        task &&
        typeof task.id === "string" &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean"
    );
  }
} catch (error) {
  console.error("Could not load saved tasks:", error);
}

function saveTasks() {
  try {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
    alert("Tasks could not be saved. Please check your browser storage.");
  }
}

function renderTasks() {
  taskList.replaceChildren();

  const completedTasks = tasks.filter(task => task.completed).length;
  taskCount.textContent =
    `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"} · ${completedTasks} completed`;

  emptyMessage.hidden = tasks.length > 0;

  tasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task-item";
    if (task.completed) item.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.text}`);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(currentTask => currentTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, deleteButton);
    taskList.appendChild(item);
  });
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    text,
    completed: false
  });

  saveTasks();
  renderTasks();

  taskForm.reset();
  taskInput.focus();
});

renderTasks();
