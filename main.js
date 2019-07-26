// Global Variables
let todoArray = JSON.parse(localStorage.getItem('todoArray')) || [];
let taskItems = [];
const addTitleInput = document.querySelector('.fieldset__input--task-title');
const addTaskInput = document.querySelector('.fieldset__input--task-item');
const header = document.querySelector('.header-container');
const aside = document.querySelector('.make-task-container');
const main = document.querySelector('.task-cards-container');

// Event Listeners
window.addEventListener('onload', loadHandler);
header.addEventListener('keyup', headerHandler);
aside.addEventListener('click', asideHandler);
aside.addEventListener('keyup', asideHandler);
main.addEventListener('click', mainHandler);

// Functions

// On Load Handler
function loadHandler(event) {
    event.preventDefault();
    if (tasks) {
        instantiateTasks();
        populateTasks();
    } else {
        toggleAddTaskMessage();
    }
}

function instantiateTasks() {

}

function populateTasks() {

}

function toggleAddTaskMessage() {

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
    removeFromArray(element)
    removeFromDom([element]);
}

function addToDom(location, position, text) {
    location.insertAdjacentHTML(position, text);
}

function removeFromDom(elements) {
    elements.forEach(element => element.remove());
}

function removeFromArray(element) {
    var removeIndex = taskItems.map(function(item) {
        return `${item.id}`;
    }).indexOf(element.dataset.id);
    ~removeIndex && taskItems.splice(removeIndex, 1);
}

function addTaskList() {
    const todoList = new TodoList({
        id: Date.now(),
        title: addTitleInput.value,
        task: taskItems,
    })
    let tasksHTML = '';
    taskItems.forEach(task => tasksHTML += `<li class="list__item" data-id=${task.id}><span class="item__checkbox item-unchecked"></span><span class="item__paragraph">${task.text}</span></li>`);
    addToDom(main, 'afterbegin',
        `<article class="article article--task-cards" data-id="${todoList.id}">
        <h2 class="article__heading">${todoList.title}</h2>
        <ul class="article__list">${tasksHTML}</ul>
        <form class="article__form article__form--task-cards">
          <button class="form__button form__button--urgent"><img class="button-image image--urgent" src="images/urgent.svg" alt="urgency icon">urgent</button>
          <button class="form__button form__button--delete"><img class="button-image image--delete"
          src="images/delete.svg"
          alt="delete icon"
          onmouseover="this.src='images/delete-active.svg'"
          onmouseout="this.src='images/delete.svg'">delete</button>
        </form>
      </article>`);
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

// function determineButtonStatus(button, input) {
//     input.value.length > 0 ? enableButton(button) : disableButton(button);
// }

function enableButton(button) {
    button.disabled = false;
}

function disableButton(button) {
    button.disabled = true;
}