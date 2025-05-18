const input = document.querySelector("[data-text-field]");
const container = document.querySelector("[data-todo-container]");
const deletedContainer = document.querySelector("[data-deleted-container]");

let testList = []; // переименовать лучше в toDoList
let deletedTasks = [];
let returnTask = [];

// думаю, кнопку не имеет смысла создавать через JS.
// она у тебя всегда есть и она одна и не меняется в
// в течении жизни всего приложения.
// Лушче создать её прям в html, получить через querySelector
// и навесить обработчик на клик.
function addBtn() {
  // переименуй переменную в button.
  // функция сама за себя говорит, что создаётся кнопка.
  // переменные называются существительным, но не глаголом.
  const addElement = document.createElement("button");
  addElement.textContent = "Добавить задачу";
  addElement.className = "add-btn";

  // обработчик лучше создать как отдельную функцию
  // и эту функцию засовывать в addEventListener.
  // Так ты вынесешь метод из addBtn() и в любой момент сможешь удалить обработчик
  // Если понадобится
  addElement.addEventListener("click", () => {
    const newText = input.value.trim();
    if (newText === "") return;
    const timeAdd = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // в testList лучше засовывать объекты, а не строки
    // чтобы манипуляция с задачами была удобнее.
    // например: toDoList.push({
    // text: newText,
    // timeAdd: timeAdd,
    // })
    testList.push(`${newText} (${timeAdd})`);
    input.value = "";
    renderTodoList();
  });
  return addElement;
}

// функции можно унифицировать
// прокидывать в функции атрибуты: text, className.
// и переименовать функцию в createButton.
// Так ты сможешь переиспользовать функцию множество раз
function createDeleteButton() {
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Удалить";
  deleteBtn.className = "delete-btn";
  return deleteBtn;
}

function deleteClick(index) {
  const timeDel = new Date().toLocaleDateString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  // тоже самое, что и с testList.
  // пуш объект с полями: {
  // task: testList[index],
  // deletedAt: timeDel
  //}
  deletedTasks.push(`${testList[index]} (${timeDel})`);
  testList.splice(index, 1);
  renderTodoList();
  renderDeletedTasks();
}

// а вот эту функцию можно назвать createDeleteButton
function delBtn(index, todoElement) {
  const deleteBtn = createDeleteButton();
  deleteBtn.addEventListener("click", () => deleteClick(index));
  todoElement.appendChild(deleteBtn);
}

// переименовать в CreaterRevertTaskButton
function retBtn(index, todoElementRet) {
  const returnBtn = document.createElement("button");
  returnBtn.textContent = "Вернуть";
  returnBtn.className = "edit-btn";

  // обработчик вынести в отедльную функцию.
  // старайся не присваивать в качестве обработчика анонимную функцию.
  // так обработчик нельзя будет удалить иначе.
  returnBtn.addEventListener("click", () => {
    testList.push(deletedTasks[index]);
    deletedTasks.splice(index, 1);
    console.log(returnTask);
    renderTodoList();
    renderDeletedTasks();
  });
  todoElementRet.appendChild(returnBtn);
}

function createEditInput(currentText) {
  // вынести созание инпута в отдельную функци с параметрами: type, value
  // чтобы её можно было переиспользовать
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = currentText;
  return editInput;
}

function editSave(e, editInput, index, timeEdit, listElement) {
  if (e.key === "Enter") {
    const newText = editInput.value.trim();
    if (newText) {
      // testList должен содержать массив объектов, а не строк
      testList[index] = `${newText} (${timeEdit})`;
      renderTodoList();
    }
  }
}

function editClick(index, listElement) {
  const timeEdit = new Date().toLocaleDateString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const nowText = listElement.querySelector("span").textContent;

  const editInput = createEditInput(nowText);
  listElement.innerHTML = "";
  listElement.appendChild(editInput);

  editInput.focus();
  editInput.addEventListener("keydown", (e) => {
    editSave(e, editInput, index, timeEdit, listElement);
  });
}

function editBtn(index, listElement) {
  // использовать созданную тобой в будущем функцию создания кнопки
  const editBtn = document.createElement("button");
  editBtn.textContent = "Редактировать";
  editBtn.className = "edit-btn";
  // обработчик вынести в отдельную функцию
  editBtn.addEventListener("click", () => {
    editClick(index, listElement);
  });
  return editBtn;
}

function renderDeletedTasks() {
  deletedContainer.innerHTML = "<h3>Удаленные задачи:</h3>";
  const headerRow = document.createElement("div");
  deletedContainer.appendChild(headerRow);
  deletedTasks.forEach((task, index) => {
    const taskContainer = document.createElement("div");
    taskContainer.className = "deleted-task";
    const taskEl = document.createElement("div");
    taskEl.className = "deleted-task";
    taskEl.textContent = task;
    taskContainer.appendChild(taskEl);
    retBtn(index, taskContainer);
    deletedContainer.appendChild(taskContainer);
  });
}

function todoText(todo) {
  const todolistText = document.createElement("span");
  todolistText.textContent = todo;
  return todolistText;
}

function todoElement(todo, index) {
  const todolistElement = document.createElement("div");
  todolistElement.appendChild(todoText(todo));

  delBtn(index, todolistElement);
  todolistElement.appendChild(editBtn(index, todolistElement));
  return todolistElement;
}

function renderTodoList() {
  container.innerHTML = "";
  const el = document.createElement("div");
  el.appendChild(input);
  el.appendChild(addBtn());
  container.appendChild(el);

  testList.forEach((todo, index) => {
    container.appendChild(todoElement(todo, index));
  });
}

// страт программы вынеси в фунцию main например
// и уже вызывай её.
// это чтобы сразу видно было, где и что запускает программу.
renderTodoList();
renderDeletedTasks();

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const text = input.value.trim();
    if (text) {
      testList.push(text);
      input.value = "";
      renderTodoList();
    }
  }
});
