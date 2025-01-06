document.addEventListener("DOMContentLoaded", () => {
    const input_task = document.getElementById("input");
    const addtaskbtn = document.getElementById("addtask");
    const list = document.getElementById("toDo");

    addtaskbtn.addEventListener("click", () => {
        if (input_task.value.trim() === "") {
            alert("Add a task to keep your day on track.");
        } else {
            addTaskToDOM(input_task.value, false);
            saveTasksToLocalStorage();
            updatePendingTaskCount();
            input_task.value = "";
        }
    });

    function addTaskToDOM(taskText, isCompleted) {
        const task = document.createElement("li");
        task.textContent = taskText;

        if (isCompleted) {
            task.classList.add("completed");
        }

        const del = document.createElement("span");
        del.textContent = "×";
        del.addEventListener("click", (event) => {
            event.stopPropagation();
            task.remove();
            saveTasksToLocalStorage();
            updatePendingTaskCount();
        });

        task.addEventListener("click", () => {
            task.classList.toggle("completed");
            saveTasksToLocalStorage();
            updatePendingTaskCount();
        });

        task.appendChild(del);
        list.appendChild(task);
    }

    function saveTasksToLocalStorage() {
        const tasks = Array.from(list.children).map((task) => ({
            text: task.textContent.replace("×", "").trim(),
            completed: task.classList.contains("completed"),
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach((task) => addTaskToDOM(task.text, task.completed));
    }

    function updatePendingTaskCount() {
        const pendingCount = Array.from(list.children).filter(
            (task) => !task.classList.contains("completed")
        ).length;
        let taskCountElement = document.getElementById("taskCount");
        if (!taskCountElement) {
            taskCountElement = document.createElement("div");
            taskCountElement.id = "taskCount";
            document.querySelector(".app").appendChild(taskCountElement);
        }
        taskCountElement.textContent = `Pending tasks: ${pendingCount}`;
    }

    loadTasksFromLocalStorage();
    updatePendingTaskCount();
});
