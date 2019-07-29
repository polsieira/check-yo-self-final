/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
// Global Variables
const todoArray = JSON.parse(localStorage.getItem('todoArray')) || [];
let taskItems = [];
const addTitleInput = document.querySelector('.fieldset__input--task-title');
const addTaskInput = document.querySelector('.fieldset__input--task-item');
const header = document.querySelector('.header-container');
const aside = document.querySelector('.make-task-container');
const main = document.querySelector('.task-cards-container');

// Event Listeners
window.addEventListener('load', loadHandler);
header.addEventListener('keyup', headerHandler);
aside.addEventListener('click', asideHandler);
aside.addEventListener('keyup', asideHandler);
main.addEventListener('click', mainHandler);

// Functions

// On Load Handler
function loadHandler(event) {
  event.preventDefault();
  if (todoArray.length > 0) {
    instantiateAndPopulateTasks();
  } else {
    toggleAddTaskMessage();
  }
}

function instantiateAndPopulateTasks() {
  for (let i = 0; i < todoArray.length; i++) {
    todoArray[i] = new TodoList(todoArray[i]);
    createCard(todoArray[i]);
  }
}

function toggleAddTaskMessage() {
  if (todoArray.length === 1) {
    removeFromDom([document.querySelector('.image--checklist'), document.querySelector('.paragraph--add-task-message')]);
  } else if (todoArray.length === 0) {
    addToDom(main, 'afterbegin', '<div class="add-task-message"><p class="paragraph--add-task-message">Create a new todo list!</p><img class="image--checklist" src="images/check-list-and-pencil.svg" alt="checklist icon"></div>');
  }
}

// On Header Handler
function headerHandler(event) {
  event.preventDefault();
  if (event.target.classList.contains('nav__input--search')) {
    searchTodos(event);
  }
}

function searchTodos(event) {
  const searchInput = event.target.value;
  const titles = document.querySelectorAll('.article__heading');
  for (let i = titles.length - 1; i >= 0; i--) {
    const todoCard = titles[i].parentNode;
    if (titles[i].innerText.toUpperCase().indexOf(searchInput.toUpperCase()) > -1 && todoCard.dataset.display === 'on') {
      todoCard.style.display = 'inline-block';
    } else {
      todoCard.style.display = 'none';
    }
  }
}

// On Aside Handler
function asideHandler(event) {
  event.preventDefault();
  if (event.target.classList.contains('button--add-task')) {
    addTask(event);
    clearFields([addTaskInput]);
  }
  if (event.target.classList.contains('image--delete-task')) {
    deleteTask(event);
  }
  if (event.target.classList.contains('button--make-task')) {
    addTaskList();
    toggleAddTaskMessage();
    clearAll();
  }
  if (event.target.classList.contains('button--clear-all')) {
    clearAll();
  }
  if (event.target.classList.contains('button--filter')) {
    toggleFilterByUrgency(event);
  }
  if (taskItems.length > 0 && checkFields([addTitleInput])) {
    enableButton(document.querySelector('.button--make-task'));
  } else {
    disableButton(document.querySelector('.button--make-task'));
  }
  if (checkFields([addTaskInput])) {
    enableButton(document.querySelector('.button--add-task'));
  } else {
    disableButton(document.querySelector('.button--add-task'));
  }
  if (checkFields([addTaskInput]) || checkFields([addTitleInput]) || taskItems.length > 0) {
    enableButton(document.querySelector('.button--clear-all'));
  } else {
    disableButton(document.querySelector('.button--clear-all'));
  }
}

function addTask() {
  if (checkFields([addTaskInput])) {
    const task = new Task({
      id: Date.now(),
      isCompleted: false,
      text: addTaskInput.value,
    });
    taskItems.push(task);
    addToDom(
      document.querySelector('.fieldset--task-title'),
      'beforeend',
      `<div class="task" data-id=${task.id}>
          <img class="image--delete-task"
          src="images/delete.svg"><p class="paragraph--task">${task.text}</p>
          </div>`,
    );
  }
}

function deleteTask(event) {
  const element = event.target.parentNode;
  removeFromArray(element, taskItems);
  removeFromDom([element]);
}

function addToDom(location, position, text) {
  location.insertAdjacentHTML(position, text);
}

function removeFromDom(elements) {
  elements.forEach(element => element.remove());
}

function removeFromArray(element, array) {
  const removeIndex = array.map(item => `${item.id}`).indexOf(element.dataset.id);
  ~removeIndex && array.splice(removeIndex, 1);
}

function addTaskList() {
  const todoList = new TodoList({
    id: Date.now(),
    title: addTitleInput.value,
    tasks: taskItems,
  });
  saveTaskList(todoList);
  createCard(todoList);
}

function saveTaskList(todoList) {
  todoArray.push(todoList);
  todoList.saveToStorage(todoArray);
}

function createCard(todoList) {
  const tasksHTML = makeHTMLForTasks(todoList);
  const classes = determineToDoListClasses(todoList);
  addToDom(main, 'afterbegin',
    `<article class="article article--task-cards ${classes.urgentCard}" data-id="${todoList.id}" data-display="on">
        <h2 class="article__heading">${todoList.title}</h2>
        <ul class="article__list">${tasksHTML}</ul>
        <form class="article__form article__form--task-cards">
          <button class="form__button form__button--urgent ${classes.urgentButton}"
          onmouseover="toggleUrgentIcon(this);"
          onmouseout="toggleUrgentIcon(this);"><img class="button-image image--urgent ${classes.urgentIcon}"
          src="images/urgent.svg"
          alt="urgency icon">urgent</button>
          <button class="form__button form__button--delete"
          onmouseover="toggleDelete(this);"
          onmouseout="toggleDelete(this);"><img class="button-image image--delete"
          src="images/delete.svg"
          alt="delete icon">delete</button>
        </form>
      </article>`);
}

function makeHTMLForTasks(todoList) {
  let tasksHTML = '';
  for (i = 0; i < todoList.tasks.length; i++) {
    const classes = determineTaskClasses(todoList.tasks[i]);
    tasksHTML += `<li class="list__item" data-id=${todoList.tasks[i].id}><span class="item__checkbox ${classes.checkedIcon}"></span><span class="item__paragraph ${classes.checkedText}">${todoList.tasks[i].text}</span></li>`;
  }
  return tasksHTML;
}

function determineTaskClasses(task) {
  classes = {};
  if (task.isCompleted) {
    classes.checkedIcon = 'item-checked';
    classes.checkedText = 'paragraph-checked';
  } else {
    classes.checkedIcon = '';
    classes.checkedText = '';
  }
  return classes;
}

function determineToDoListClasses(todoList) {
  const classes = {};
  if (todoList.isUrgent) {
    classes.urgentButton = 'form__button--urgent-active';
    classes.urgentIcon = 'image--urgent-active';
    classes.urgentCard = 'article--task-cards-urgent';
  } else {
    classes.urgentButton = '';
    classes.urgentIcon = '';
    classes.urgentCard = '';
  }
  return classes;
}

function clearAll() {
  clearFields([addTitleInput, addTaskInput]);
  removeFromDom(document.querySelectorAll('.task'));
  clearTaskArray();
}

function clearTaskArray() {
  taskItems = [];
}

function toggleFilterByUrgency(event) {
  toggleFilterButton();
  toggleTodoListOnDom(event);
}

function toggleFilterButton() {
  document.querySelector('.button--filter').classList.toggle('button--filter-active');
}

function toggleTodoListOnDom(event) {
  const todoCards = document.querySelectorAll('.article--task-cards');
  if (event.target.classList.contains('button--filter-active')) {
    showUrgent(todoCards);
  } else {
    showAll(todoCards);
  }
  toggleUrgentMessage();
}

function showUrgent(todoCards) {
  for (let i = todoCards.length - 1; i >= 0; i--) {
    if (todoCards[i].classList.contains('article--task-cards-urgent')) {
      todoCards[i].style.display = 'inline-block';
      todoCards[i].dataset.display = 'on';
    } else {
      todoCards[i].style.display = 'none';
      todoCards[i].dataset.display = 'off';
    }
  }
}

function showAll(todoCards) {
  for (let i = todoCards.length - 1; i >= 0; i--) {
    todoCards[i].style.display = 'inline-block';
  }
}

function toggleUrgentMessage() {
  if (document.querySelectorAll('.article--task-cards-urgent').length === 0 && !document.querySelector('.paragraph--add-urgent-message') && !document.querySelector('.paragraph--add-task-message')) {
    addToDom(main, 'afterbegin', '<div class="add-urgent-message"><p class="paragraph--add-urgent-message">Make a todo list Urgent!</p><img class="image--urgent-message" src="images/file-urgent.svg" alt="urgent icon"></div>');
  } else if (document.querySelector('.paragraph--add-urgent-message')) {
    removeFromDom([document.querySelector('.paragraph--add-urgent-message'), document.querySelector('.image--urgent-message')]);
  }
}

// On Main Handler
function mainHandler(event) {
  event.preventDefault();
  if (event.target.classList.contains('item__checkbox')) {
    toggleCheckOffTask(event);
    const index = locateTaskIndex(event.target.parentNode);
    todoArray[index[0]].tasks[index[1]].isCompleted = !todoArray[index[0]].tasks[index[1]].isCompleted;
    todoArray[index[0]].saveToStorage(todoArray); // Refactor
  }
  if (event.target.classList.contains('form__button--urgent')) {
    toggleUrgentIcon(event.target);
    toggleUrgentCard(event.target);
    const index = locateTodoListIndex(event.target.parentNode.parentNode);
    todoArray[index].isUrgent = !todoArray[index].isUrgent;
    todoArray[index].saveToStorage(todoArray); // Refactor
  }
}

function toggleCheckOffTask(event) {
  event.target.classList.toggle('item-checked');
  event.target.nextSibling.classList.toggle('paragraph-checked');
}

function toggleUrgentIcon(element) {
  element.firstChild.classList.toggle('image--urgent-active');
  element.classList.toggle('form__button--urgent-active');
}

function toggleUrgentCard(button) {
  button.parentNode.parentNode.classList.toggle('article--task-cards-urgent');
}

// Hover Function
function toggleDelete(element) {
  element.firstChild.classList.toggle('image--delete-active');
  element.classList.toggle('form__button--delete-active');
}

// Random functions
function locateTaskIndex(task) {
  const todoList = task.parentNode.parentNode;
  const todoListIndex = locateTodoListIndex(todoList);
  const taskIndex = todoArray[todoListIndex].tasks.findIndex(element => element.id == task.dataset.id);
  return [todoListIndex, taskIndex];
}

function locateTodoListIndex(todoList) {
  const index = todoArray.findIndex(element => element.id == todoList.dataset.id);
  return index;
}

function checkFields(fields) {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].value === '') {
      return false;
    }
  }
  return true;
}

function clearFields(inputs) {
  inputs.forEach(input => input.value = '');
}

function enableButton(button) {
  button.disabled = false;
}

function disableButton(button) {
  button.disabled = true;
}
