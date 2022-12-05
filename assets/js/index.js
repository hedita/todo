const addTaskIcon = document.getElementById("add-task-icon");
const addTaskInput = document.getElementById("add-task-input");
const errorMessage = document.getElementById("error-message");
const backendErrorMessage = document.getElementById("backend-error-message");
const todoList = document.getElementById("todo-list");
const url = "http://localhost:3030/todos";

async function postTodo(todoText) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: todoText }),
    });
    const {error, data} = await response.json();
   
    if (response.status !== 201) {
      errorMessage.innerText = error;
    }
  } catch (error) {
    backendErrorMessage.innerText = "Something went wrong!";
  }
}

addTaskIcon.addEventListener("click", async function () {
  await postTodo(addTaskInput.value);
  clearAddTodoInput();
  clearErrorMessage();
  const tasks = await getTasks();
  showTasks(tasks);
});

addTaskInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    await postTodo(addTaskInput.value);
    clearAddTodoInput();
    clearErrorMessage();
    const tasks = await getTasks();
    showTasks(tasks);
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
    const response = await fetch(url);
    const {data} = await response.json();
    return data;
  } catch {
    backendErrorMessage.innerText = "Something went wrong!";
  }
}
const tasks = getTasks();
console.log(tasks)

function showTasks(tasks) {
  let listHtml = "";

  tasks.forEach(({text}) => {
    console.log(text)
    listHtml += `<li class="todo-item id="todo-item">
    <p class="todo">${text}</p></li>`
  });
  todoList.innerHTML = listHtml;
}