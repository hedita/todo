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
    }
  } catch (error) {
    showNetworkError();
  }
}

addTaskIcon.addEventListener("click", async function () {
  await postTodo(addTaskInput.value);
  clearAddTodoInput();
  clearErrorMessage();
  const tasks = await getTasks();
  showTasks(tasks);
  filterItemAllTasks();
  filterItemCompletedTasks();
  filterItemUncompletedTasks();
});

addTaskInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    await postTodo(addTaskInput.value);
    clearAddTodoInput();
    clearErrorMessage();
    const tasks = await getTasks();
    showTasks(tasks);
    filterItemAllTasks();
    filterItemCompletedTasks();
    filterItemUncompletedTasks();
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
  todoList.innerHTML = tasks.sort(
    (a, b) => new Date(b.createdAt) -  new Date(a.createdAt)
  ).map(({text, createdAt}) => `<li class="todo-item">
    <input type="checkbox" />
    <p class="todo"  title="${formatDate(createdAt)}">${text}</p>
    <i class="fa-solid fa-pen-to-square edite-icon"></i>
    <i class="fa-solid fa-xmark remove-icon"></i>
    </li>`).join("");
}

async function filterItemAllTasks() {
  const tasks = await getTasks();
  filterItemAll.innerText = tasks.length;
}

async function filterItemCompletedTasks() {
  const tasks = await getTasks();
  filterItemCompleted.innerText = tasks.filter(task => task.isDone).length;
}

async function filterItemUncompletedTasks() {
  const tasks = await getTasks();
  filterItemUncompleted.innerText = tasks.filter(task => !task.isDone).length;
}

function showNetworkError() {
  backendErrorMessage.innerText = "Something went wrong!";
}