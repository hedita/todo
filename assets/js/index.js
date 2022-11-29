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
    if (response.status !=  200 && response.status != 201) {
      errorMessage.innerText = response.statusText;
    }
  } catch (error) {
    backendErrorMessage.innerText = "Something went wrong!";
  }
}

addTaskIcon.addEventListener("click", function () {
  postTodo(addTaskInput.value);
  clearAddTodoInput();
});

addTaskInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    postTodo(addTaskInput.value);
    clearAddTodoInput();
  }
});

function clearAddTodoInput() {
  addTaskInput.value = "";
}