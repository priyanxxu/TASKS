// Form Validation
document.getElementById("contactForm").addEventListener("submit", function (event) {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let problem = document.getElementById("problem").value.trim();
    if (name === "" || email === "" || phone === "" || problem === "") {
        alert("Enter all details!");
        event.preventDefault();
        return;
    }
    if (!email.includes("@") || !email.includes(".")) {
        alert("Enter a valid email!");
        event.preventDefault();
        return;
    }
    let phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {
        alert("Enter a valid 10-digit phone number!");
        event.preventDefault();
        return;
    }
});
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

    loadTasks();
}
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
function toggleTasks() {
    let list = document.getElementById("taskList");

    if (list.style.display === "none" || list.style.display === "") {
        list.style.display = "block";
    } else {
        list.style.display = "none";
    }
}
function resetTasks() {
    localStorage.removeItem("tasks");
    document.getElementById("taskList").innerHTML = "";
}