const addIcon = document.getElementById("add-icon");
const input = document.getElementById("input");

async function postTodo() {
  const url = "http://localhost:3030/todos";

  const response = await fetch(url,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({text: input.value})
  });
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