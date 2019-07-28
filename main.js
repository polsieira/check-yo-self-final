// Global Variables
let todoArray = JSON.parse(localStorage.getItem('todoArray')) || [];
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
    for (i = 0; i < todoArray.length; i++) {
        todoArray[i] = new TodoList(todoArray[i]);
        createCard(todoArray[i]);
    }
}

function toggleAddTaskMessage() {
    if (todoArray.length > 0) {
        document.querySelector('.paragraph--add-task-message').remove();
        document.querySelector('.image--checklist').remove();
    } else {
        addToDom(main, 'afterbegin', `<p class="paragraph--add-task-message">Create a new todo list!</p><img class="image--checklist" src="images/check-list-and-pencil.svg" alt="checklist icon">`);
    }
}

// On Header Handler
function headerHandler(event) {
    event.preventDefault();
    if (event.target.classList.contains('nav__input--search')) {

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
        const task = new Task({ id: Date.now(), isCompleted: false, text: addTaskInput.value });
        taskItems.push(task);
        addToDom(
            document.querySelector('.fieldset--task-title'),
            'beforeend',
            `<div class="task" data-id=${task.id}>
          <img class="image--delete-task"
          src="images/delete.svg"><p class="paragraph--task">${task.text}</p>
          </div>`);
    }
}

function deleteTask(event) {
    var element = event.target.parentNode;
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
    var removeIndex = array.map(function(item) {
        return `${item.id}`;
    }).indexOf(element.dataset.id);
    ~removeIndex && array.splice(removeIndex, 1);
}

function addTaskList() {
    const todoList = new TodoList({
        id: Date.now(),
        title: addTitleInput.value,
        tasks: taskItems,
    })
    saveTaskList(todoList);
    createCard(todoList);
}

function saveTaskList(todoList) {
    todoArray.push(todoList);
    todoList.saveToStorage(todoArray);
}

function createCard(todoList) {
    tasksHTML = makeHTMLForTasks(todoList);
    addToDom(main, 'afterbegin',
        `<article class="article article--task-cards" data-id="${todoList.id}">
        <h2 class="article__heading">${todoList.title}</h2>
        <ul class="article__list">${tasksHTML}</ul>
        <form class="article__form article__form--task-cards">
          <button class="form__button form__button--urgent"><img class="button-image image--urgent"
          src="images/urgent.svg"
          alt="urgency icon"
          onmouseover="this.src='images/urgent-active.svg'"
          onmouseout="this.src='images/urgent.svg'">urgent</button>
          <button class="form__button form__button--delete"><img class="button-image image--delete"
          src="images/delete.svg"
          alt="delete icon"
          onmouseover="this.src='images/delete-active.svg'"
          onmouseout="this.src='images/delete.svg'">delete</button>
        </form>
      </article>`);
}

function makeHTMLForTasks(todoList) {
    let tasksHTML = '';
    todoList.tasks.forEach(task => tasksHTML += `<li class="list__item" data-id=${task.id}><span class="item__checkbox item-unchecked"></span><span class="item__paragraph">${task.text}</span></li>`);
    return tasksHTML;
}

function clearAll() {
    clearFields([addTitleInput, addTaskInput]);
    removeFromDom(document.querySelectorAll('.task'));
    clearTaskArray();
}

function clearTaskArray() {
    taskItems = [];
}

// On Main Handler
function mainHandler(event) {
    event.preventDefault();
}

// Random functions
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