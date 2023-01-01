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
const requestDefaultHeaders = { "Content-Type": "application/json" };

async function postTodo(todoText) {
  try {
    const response = await fetch(`${url}/todos`, {
      method: "POST",
      headers: requestDefaultHeaders,
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
      headers: requestDefaultHeaders,
    });
    renderTasks();
  } catch (error) {
    showNetworkError();
  }
}

async function editTodo(taskId, todoText) {
  try {
    await fetch(`${url}/todos/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ text: todoText }),
      headers: requestDefaultHeaders,
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
  todoList.innerHTML = sortTasksByStatus(sortTasksByTime(tasks))
    .map(({ text, createdAt, id: taskId, isDone }) =>
    `<li id="${taskId}" class="todo-item">
    <input id="checkbox-${taskId}" class="checkbox" type="checkbox" ${isChecked(isDone)}/>
    <div id="todo-container-${taskId}">
    <p class="todo" title="${formatDate(createdAt)}">${text}</p>
    </div>
    <i id="edit-icon-${taskId}" class="fa-solid fa-pen-to-square edit-icon"></i>
    <i id="remove-icon-${taskId}"class="fa-solid fa-xmark remove-icon"></i>
    </li>`).join("");
  bindDeleteEvent();
  bindUpdateEvent();
  bindEditEvent();
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
      console.log(event.target.parentNode)
    })
  });
}

function bindUpdateEvent() {
  const checkboxes = Array.from(document.getElementsByClassName("checkbox"));
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", function (event) {
      updateStatus(event.target.parentNode.id, this.checked);
    })
  });
}

function bindEditEvent() {
  const editIcons = Array.from(document.getElementsByClassName("edit-icon"));
  editIcons.forEach(editIcon => {
    editIcon.addEventListener("click", function (event) {
      const taskId = event.target.parentNode.id;
      const todoContainer = document.getElementById(`todo-container-${taskId}`);
      const todoText = todoContainer.innerText;
      todoContainer.innerHTML = `<input class="edited-todo" type="text" value="${todoContainer.innerText}"/>
      <i id="check-icon-${taskId}" class="fa-solid fa-check check-icon"></i>`
      handleIcons(taskId, editIcon);
      handleCheckIcon(todoText);
    })
  });
}

function handleCheckIcon(todoText) {
  const checkIcons = Array.from(document.getElementsByClassName("check-icon"));
  checkIcons.forEach(checkIcon => {
    checkIcon.addEventListener("click", function (event) {
      editTodo(event.target.parentNode.parentNode.id, todoText);
      handleEditedTodo();
    })
  })
}

function handleIcons(taskId, editIcon) {
  const removeIcon = document.getElementById(`remove-icon-${taskId}`)
  const checkbox = document.getElementById(`checkbox-${taskId}`)
  editIcon.style.visibility = "hidden";
  removeIcon.style.visibility = "hidden";
  checkbox.style.visibility = "hidden";
}

function handleEditedTodo() {
  const editedTodos = Array.from(document.getElementsByClassName("edited-todo"));
  editedTodos.forEach(editedTodo => {

  })
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