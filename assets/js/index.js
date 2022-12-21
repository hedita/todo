const addTaskIcon = document.getElementById("add-task-icon");
const addTaskInput = document.getElementById("add-task-input");
const errorMessage = document.getElementById("error-message");
const backendErrorMessage = document.getElementById("backend-error-message");
const todoList = document.getElementById("todo-list");
const filterItemAll = document.getElementById("filter-item-all");
const filterItemUncompleted = document.getElementById(
  "filter-item-uncompleted"
);
const filterItemCompleted = document.getElementById("filter-item-completed");
const url = "http://localhost:3030";

async function postTodo(todoText) {
  try {
    const response = await fetch(`${url}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: todoText }),
    });
    const { error } = await response.json();

    if (response.status !== 201) {
      errorMessage.innerText = error;
    } else {
      clearErrorMessage();
    }
  } catch (error) {
    showNetworkError();
  }
}

async function deleteTodo(taskId) {
  try {
    await fetch(`${url}/todos/${taskId}`, {
      method: "DELETE"
    });
    renderTasks();
  } catch (error) {
    showNetworkError();
  }
}

async function updateStatus(taskId, isDone) {
  try {
    await fetch(`${url}/todos/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ isDone }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    renderTasks();
  } catch (error) {
    showNetworkError();
  }
}

addTaskIcon.addEventListener("click", async function () {
  await postTodo(addTaskInput.value);
  clearAddTodoInput();
  renderTasks();
});

addTaskInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    await postTodo(addTaskInput.value)
    clearAddTodoInput();
    renderTasks();
  }
});

function clearAddTodoInput() {
  addTaskInput.value = "";
}

function clearErrorMessage() {
  errorMessage.innerText = "";
  backendErrorMessage.innerText = "";
}

async function getTasks() {
  try {
    const response = await fetch(`${url}/todos`);
    const { data } = await response.json();
    return data;
  } catch {
    showNetworkError();
  }
}

function formatDate(date) {
  const dateTime = new Date(date);
  const year = dateTime.toLocaleDateString("en-US", { year: "numeric" });
  const month = dateTime.toLocaleDateString("en-US", { month: "short" });
  const day = dateTime.toLocaleDateString("en-US", { day: "numeric" });

  return `${day} ${month} ${year}`;
}

function showTasks(tasks) {
  todoList.innerHTML = sortTasksByIsDone(sortTasksByTime(tasks))
    .map(({ text, createdAt, id: taskId, isDone }) =>
    `<li id="${taskId}" class="todo-item">
    <input class="checkbox" type="checkbox" ${isChecked(isDone)}/>
    <p class="todo"  title="${formatDate(createdAt)}">${text}</p>
    <i class="fa-solid fa-pen-to-square edite-icon"></i>
    <i class="fa-solid fa-xmark remove-icon"></i>
    </li>`).join("");
  bindDeleteEvent();
}

function updateAllTasksCount(tasks) {
  filterItemAll.innerText = tasks.length;
}

function updateCompletedTasksCount(tasks) {
  filterItemCompleted.innerText = tasks.filter(task => task.isDone).length;
}

function updateUncompletedTasksCount(tasks) {
  filterItemUncompleted.innerText = tasks.filter(task => !task.isDone).length;
}

function updateFilterCounts(tasks) {
  updateAllTasksCount(tasks);
  updateCompletedTasksCount(tasks);
  updateUncompletedTasksCount(tasks);
}

function showNetworkError() {
  backendErrorMessage.innerText = "Something went wrong!";
}

async function renderTasks() {
  const tasks = await getTasks();
  showTasks(tasks);
  updateFilterCounts(tasks);
}

function bindDeleteEvent() {
  const removeIcons = Array.from(document.getElementsByClassName("remove-icon"));
  removeIcons.forEach(removeIcon => {
    removeIcon.addEventListener("click", function (event) {
      deleteTodo(event.target.parentNode.id);
    })
  });
}

function bindUpdateEvent() {
  const checkboxs = Array.from(document.getElementsByClassName("checkbox"));
  checkboxs.forEach(checkbox => {
    checkbox.addEventListener("change", function (event) {
      updateStatus(event.target.parentNode.id, this.checked);
    })
  });
}

function isChecked(isDone) {
  if (isDone === true) {
    return "checked"
  } else {
    return ""
  }
}

function sortTasksByTime(tasks) {
  return tasks.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}

function sortTasksByStatus(tasks) {
  return tasks.sort(
    (a, b) => a.isDone - b.isDone
  )
}

renderTasks();