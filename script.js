// ==========================
// TaskFlow Lite
// ==========================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const themeBtn = document.getElementById("themeBtn");

const total = document.getElementById("total");
const completed = document.getElementById("completed");
const remaining = document.getElementById("remaining");

const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ---------------------------
// Theme
// ---------------------------

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️ Light Mode";
}

themeBtn.onclick = function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeBtn.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeBtn.textContent = "🌙 Dark Mode";
    }

};

// ---------------------------
// Save Tasks
// ---------------------------

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---------------------------
// Update Counter
// ---------------------------

function updateCounter() {

    total.textContent = tasks.length;

    const completedTasks = tasks.filter(task => task.completed).length;

    completed.textContent = completedTasks;

    remaining.textContent = tasks.length - completedTasks;

}

// ---------------------------
// Render Tasks
// ---------------------------

function renderTasks() {

    taskList.innerHTML = "";

    let filtered = tasks;

    if (currentFilter === "active") {
        filtered = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filtered = tasks.filter(task => task.completed);
    }

    filtered.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
        <label>
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <span>${task.text}</span>
        </label>

        <div class="actions">

            <button class="edit">✏️</button>

            <button class="delete">🗑️</button>

        </div>
        `;

        // Checkbox

        li.querySelector("input").addEventListener("change", function () {

            task.completed = this.checked;

            saveTasks();

            renderTasks();

        });

        // Delete

        li.querySelector(".delete").addEventListener("click", function () {

            if (!confirm("Delete this task?")) return;

            tasks = tasks.filter(t => t.id !== task.id);

            saveTasks();

            renderTasks();

        });

        // Edit

        li.querySelector(".edit").addEventListener("click", function () {

            const newText = prompt("Edit Task", task.text);

            if (!newText) return;

            task.text = newText.trim();

            saveTasks();

            renderTasks();

        });

        taskList.appendChild(li);

    });

    updateCounter();

}

// ---------------------------
// Add Task
// ---------------------------

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        addTask();

    }

});

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task.");

        return;

    }

    tasks.push({

        id: Date.now(),

        text,

        completed: false

    });

    saveTasks();

    taskInput.value = "";

    renderTasks();

}

// ---------------------------
// Filters
// ---------------------------

filterButtons.forEach(btn => {

    btn.addEventListener("click", function () {

        filterButtons.forEach(b => b.classList.remove("active"));

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();

    });

});

// ---------------------------
// Start
// ---------------------------

renderTasks();