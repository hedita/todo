const addTaskIcon = document.getElementById("add-task-icon");
const addTaskInput = document.getElementById("add-task-input");
const errorMessage = document.getElementById("error-message");
const backendErrorMessage = document.getElementById("backend-error-message");
const todoList = document.getElementById("todo-list");
const filterItemAll = document.getElementById("filter-item-all");
const filterItemUncompleted = document.getElementById(
  "filter-item-uncompleted"
);
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
    const { error, data } = await response.json();

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
  filterItemAll.innerText = tasks.length;
  filterItemUncompleted.innerText = tasks.length;
});

addTaskInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    await postTodo(addTaskInput.value);
    clearAddTodoInput();
    clearErrorMessage();
    const tasks = await getTasks();
    showTasks(tasks);
    filterItemAll.innerText = tasks.length;
    filterItemUncompleted.innerText = tasks.length;
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
    backendErrorMessage.innerText = "Something went wrong!";
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
  const sortedTasks = tasks.sort(
    (objA, objB) => new Date(objB.createdAt) - new Date(objA.createdAt)
  );

  let listHtml = "";
  sortedTasks.forEach(({ text, createdAt: date }) => {
    listHtml += ` <li class="todo-item">
    <input type="checkbox" />
    <p class="todo"  title="${formatDate(date)}">${text}</p>
    <i class="fa-solid fa-pen-to-square edite-icon"></i>
    <i class="fa-solid fa-xmark remove-icon"></i>
    </li>`;
  });
  todoList.innerHTML = listHtml;
}

function filterItem() {
  filterItemAll.innerText = tasks.length;
  filterItemUncompleted.innerText = tasks.length;
}

function showNetworkError() {
  backendErrorMessage.innerText = "Something went wrong!";
}