const addTaskIcon = document.getElementById("add-icon");
const addTaskInput = document.getElementById("input");
const errorMessage = document.getElementById("error-message")
const backendErrorMessage = document.getElementById("backend-error-message");

async function postTodo() {
  const url = "http://localhost:3030/todos";
  
  try {
    const response = await fetch(url,{
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({text: addTaskInput.value})
    });
    if (response.status === 400) {
      errorMessage.innerText = "Something went wrong!";
    }
  }
  catch(error) {
    backendErrorMessage.innerText = error.message;
  }
}

addTaskIcon.addEventListener("click", function() {
  postTodo();
  clearAddTodoInput();
})

input.addEventListener("keydown",(e) => {
  if (e.key == "Enter") {
    postTodo(addTaskInput.value);
    clearAddTodoInput();
  }
});

function clearAddTodoInput() {
  addTaskInput.value = "";
}