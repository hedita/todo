const addTaskIcon = document.getElementById("add-task-icon");
const addTaskInput = document.getElementById("add-task-input");
const errorMessage = document.getElementById("error-message");
const backendErrorMessage = document.getElementById("backend-error-message");

async function postTodo(todoText) {
  const url = "http://localhost:3030/todos";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: todoText }),
    });
    const {error} = await response.json();
    if (response.status !== 201) {
      errorMessage.innerText = error;
    }
  } catch (error) {
    backendErrorMessage.innerText = "Something went wrong!";
  }
}

addTaskIcon.addEventListener("click", function () {
  postTodo(addTaskInput.value);
  clearAddTodoInput();
  resetErrorMessage();
});

addTaskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    postTodo(addTaskInput.value);
    clearAddTodoInput();
    resetErrorMessage();
  }
});

function clearAddTodoInput() {
  addTaskInput.value = "";
}

function resetErrorMessage() {
  errorMessage.innerText = "";
  backendErrorMessage.innerText = "";
}