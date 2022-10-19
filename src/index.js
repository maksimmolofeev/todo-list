import { nanoid } from "nanoid";

import "./index.scss";

const inputTodo = document.querySelector(".new_todo");
const listTodo = document.querySelector(".todo-list");
const todoCountEl = document.querySelector("span.todo-count");
const btnFilters = document.querySelector(".filters");
const bntClear = document.querySelector(".clear");

let filter = localStorage.getItem("filter") || "all";

let todos = {};
try {
  todos = JSON.parse(localStorage.getItem("todos"));

  if (!todos || Array.isArray(todos)) {
    todos = {};
  }
} catch (_) {
  todos = {};
}

const syncStore = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("filter", filter);
};

const renderTodos = () => {
  const todoIds = Object.keys(todos);

  const todoListHtml = todoIds.reduce((acc, id) => {
    const todo = todos[id];
    const { done, text } = todo; // диструктуризация

    if (
      filter === "all" ||
      (filter === "active" && !done) ||
      (filter === "complited" && done)
    ) {
      acc += `<li><div class="form-check">
        <input class="form-check-input todo-close" type="checkbox" ${
          done ? "checked" : ""
        } id="${id}">
        <label class="form-check-label todo-label ${
          done ? "clossed-out" : ""
        }" for="${id}">${text}</label>
        <button type="button" class="btn-close close" aria-label="Close" id="${id}"></button>
      </div></li>`;
    }
    return acc;
  }, "");

  //console.log(btnFilters.children);

  Array.from(btnFilters.children).forEach((item) => {
    if (item.dataset.filter === filter) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });

  listTodo.innerHTML = todoListHtml;
  todoCountEl.innerHTML = todoIds.length;
};

// Добавление нового объекта
function newTodo(text) {
  todos[nanoid()] = { text, done: false };
}

// Добавление новой задачи
inputTodo.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    newTodo(inputTodo.value);
    inputTodo.value = "";

    renderTodos();
    syncStore();
  }
});

// Зачеркивание выполненой задачи
listTodo.addEventListener("click", (event) => {
  const { target } = event;
  if (target.type === "checkbox") {
    const todoItem = todos[target.id];
    todoItem.done = !todoItem.done;
    //console.log(todos);
    renderTodos();
    syncStore();
  }
});

btnFilters.addEventListener("click", (event) => {
  const { target } = event;
  if (
    target.dataset.filter === "all" ||
    target.dataset.filter === "active" ||
    target.dataset.filter === "complited"
  ) {
    filter = target.dataset.filter;
  }

  renderTodos();
  syncStore();
});

listTodo.addEventListener("click", (event) => {
  const { target } = event;
  if (target.type === "button") {
    delete todos[target.id];
    renderTodos();
    syncStore();
  }
});

bntClear.addEventListener("click", () => {
  Object.keys(todos).forEach((id) => {
    if (todos[id].done) {
      delete todos[id];
    }
  });

  renderTodos();
  syncStore();
});

renderTodos();
