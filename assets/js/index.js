const addIcon = document.getElementById("add-icon");
const input = document.getElementById("input");
const errorHandling = document.getElementById("error-handling")

async function postTodo() {
  const url = "http://localhost:3030/todos";
  
  try {
    const response = await fetch(url,{
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({text: input.value})
    });
    if (response.status != 200) {
      errorHandling.innerText = "Something went wrong!";
    }
  }
  catch (error) {
    errorHandling.innerText = "Something went wrong!";
  }
}

addIcon.addEventListener("click", function() {
  postTodo(input.value);
  clearInput();
})

input.addEventListener("keydown",(e) => {
  if (e.key == "Enter") {
  postTodo(input.value);
  clearInput();
  }
});

function clearInput() {
  input.value = "";
}