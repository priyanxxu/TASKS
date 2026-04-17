// Form Validation
document.getElementById("contactForm").addEventListener("submit", function (event) {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let problem = document.getElementById("problem").value.trim();

    // Check empty fields
    if (name === "" || email === "" || phone === "" || problem === "") {
        alert("Enter all details!");
        event.preventDefault();
        return;
    }

    // Email validation
    if (!email.includes("@") || !email.includes(".")) {
        alert("Enter a valid email!");
        event.preventDefault();
        return;
    }

    // Phone validation (10 digits)
    let phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {
        alert("Enter a valid 10-digit phone number!");
        event.preventDefault();
        return;
    }
});

// Add Task
function addTask() {
    let input = document.getElementById("problem");
    let taskText = input.value.trim();

    if (taskText.length === 0) {
        alert("Please enter tasks!");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push(taskText);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    input.value = "";

    loadTasks(); // Update UI instantly
}

// Load Tasks
function loadTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task) => {
        let li = document.createElement("li");
        li.innerText = task;
        taskList.appendChild(li);
    });
}

// Show / Hide Tasks
function toggleTasks() {
    let list = document.getElementById("taskList");

    if (list.style.display === "none" || list.style.display === "") {
        list.style.display = "block";
    } else {
        list.style.display = "none";
    }
}

// Reset Tasks
function resetTasks() {
    localStorage.removeItem("tasks");
    document.getElementById("taskList").innerHTML = "";
}