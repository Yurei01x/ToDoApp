// DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const tasksContainer = document.getElementById("tasksContainer");
const taskTemplate = document.getElementById("taskTemplate");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Create new task
function createTask(taskText, completed = false) {
  return {
    id: Date.now(),
    text: taskText,
    completed: completed,
  };
}

// Add new task
function addTask(event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const task = createTask(taskText);
  tasks.push(task);
  saveTasks();
  renderTask(task);

  taskInput.value = "";
  taskInput.focus();
}

// Render single task
function renderTask(task) {
  const taskCard = taskTemplate.content.cloneNode(true);
  const taskElement = taskCard.querySelector(".task-card");

  taskElement.dataset.id = task.id;
  taskElement.querySelector(".task-text").textContent = task.text;
  taskElement.querySelector(".task-checkbox").checked = task.completed;

  if (task.completed) {
    taskElement.classList.add("completed");
  }

  // Event listeners
  taskElement
    .querySelector(".task-checkbox")
    .addEventListener("change", toggleTask);
  taskElement
    .querySelector(".btn-delete")
    .addEventListener("click", deleteTask);

  tasksContainer.prepend(taskElement);
}

// Toggle task completion
function toggleTask(event) {
  const taskCard = event.target.closest(".task-card");
  const taskId = parseInt(taskCard.dataset.id);
  const task = tasks.find((t) => t.id === taskId);

  if (task) {
    task.completed = event.target.checked;
    taskCard.classList.toggle("completed");
    saveTasks();
  }
}

// Delete task
function deleteTask(event) {
  const taskCard = event.target.closest(".task-card");
  const taskId = parseInt(taskCard.dataset.id);

  taskCard.style.animation = "fadeOut 0.3s ease";
  taskCard.addEventListener("animationend", () => {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    taskCard.remove();
  });
}

// Initialize app
function initApp() {
  // Render existing tasks
  tasks.forEach((task) => renderTask(task));

  // Event listeners
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addTask(event);
    }
  });
}

// Start the app
initApp();
