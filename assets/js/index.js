const addTaskIcon = document.getElementById("add-task-icon");
const addTaskInput = document.getElementById("add-task-input");
const errorMessage = document.getElementById("error-message");
const backendErrorMessage = document.getElementById("backend-error-message");
const todoList = document.getElementById("todo-list");
const filterStatusAll = document.getElementById("filter-status-all");
const filterStatusCompleted = document.getElementById("filter-status-completed");
const filterStatusUncompleted = document.getElementById("filter-status-uncompleted");
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

async function editTodo(taskId, newText) {
  try {
    await fetch(`${url}/todos/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ text: newText }),
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
  const orderedTasks = filterTasks(sortTasksByStatus(sortTasksByTime(tasks)));
  todoList.innerHTML = orderedTasks.map(({ text, createdAt, id: taskId, isDone, updatedAt }) =>
    `<li id="${taskId}" class="todo-item">
    <input id="checkbox-${taskId}" class="task-item-checkbox" type="checkbox" ${isChecked(isDone)}/>
    <div id="todo-container-${taskId}">
    <p class="todo" id="todo-${taskId}" title="${formatDate(createdAt)} ${formatDate(updatedAt)}">${text}</p>
    </div>
    <i id="edit-icon-${taskId}" class="fa-solid fa-pen-to-square edit-icon"></i>
    <i id="remove-icon-${taskId}"class="fa-solid fa-xmark remove-icon"></i>
    </li>`).join("");
  bindDeleteEvent();
  bindUpdateIsDoneEvent();
  bindUpdateTextEvent();
}

function updateAllTasksCount(tasks) {
  filterItemAll.innerText = `(${tasks.length})`;
}

function updateCompletedTasksCount(tasks) {
  filterItemCompleted.innerText = `(${tasks.filter(task => task.isDone).length})`;
}

function updateUncompletedTasksCount(tasks) {
  filterItemUncompleted.innerText = `(${tasks.filter(task => !task.isDone).length})`;
}

filterStatusAll.addEventListener("click", function () {
  localStorage.setItem("filtered-tasks-list", "filterItemAll");
  renderTasks();
})

filterStatusCompleted.addEventListener("click", function () {
  localStorage.setItem("filtered-tasks-list", "filterItemCompleted");
  renderTasks();
})

filterStatusUncompleted.addEventListener("click", function () {
  localStorage.setItem("filtered-tasks-list", "filterItemUncompleted");
  renderTasks();
})

function filterTasks(tasks) {
  const filteredTasks = localStorage.getItem("filtered-tasks-list");
  if (filteredTasks === "filterItemCompleted") {
    return tasks.filter(task => task.isDone);
  }
  else if (filteredTasks === "filterItemUncompleted") {
    return tasks.filter(task => !task.isDone);
  } else {
    return tasks
  }
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

function bindUpdateIsDoneEvent() {
  const taskItemCheckboxes = document.querySelectorAll(".task-item-checkbox");
  taskItemCheckboxes.forEach(taskItemCheckbox => {
    taskItemCheckbox.addEventListener("change", function (event) {
      updateStatus(event.target.parentNode.id, this.checked);
    })
  });
}

async function bindUpdateTextEvent() {
  const editIcons = document.querySelectorAll(".edit-icon");
  editIcons.forEach(editIcon => {
    editIcon.addEventListener("click", function (event) {
      const { id: taskId } = event.target.parentNode;
      const todoContainer = document.getElementById(`todo-container-${taskId}`);
      const todoText = todoContainer.innerText;
      todoContainer.innerHTML = `<input id="input-${taskId}" type="text" value="${todoText}"/>
      <i id="check-icon-${taskId}" class="fa-solid fa-check check-icon"></i>`
      const checkIcon = document.getElementById(`check-icon-${taskId}`);
      checkIcon.addEventListener("click", function () {
        const newValue = document.getElementById(`input-${taskId}`).value.trim();
        if (newValue === "") {
          todoContainer.innerHTML = todoText;
        }
        else if (newValue !== todoText) {
          editTodo(taskId, newValue);
        } else {
          renderTasks();
        }
      })
      hideTodoItemIcons(taskId);
    })
  });
}

function hideTodoItemIcons(taskId) {
  document.getElementById(`remove-icon-${taskId}`).style.display = "none";
  document.getElementById(`checkbox-${taskId}`).style.display = "none";
  document.getElementById(`edit-icon-${taskId}`).style.display = "none";
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