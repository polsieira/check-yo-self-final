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
    let tasksHTML = makeHTMLForTasks(todoList);
    let classes = determineToDoListClasses(todoList);
    addToDom(main, 'afterbegin',
        `<article class="article article--task-cards ${classes.urgentCard}" data-id="${todoList.id}">
        <h2 class="article__heading">${todoList.title}</h2>
        <ul class="article__list">${tasksHTML}</ul>
        <form class="article__form article__form--task-cards">
          <button class="form__button form__button--urgent ${classes.urgentButton}"
          onmouseover="onHoverUrgent();"
          onmouseout="offHoverUrgent();"><img class="button-image image--urgent ${classes.urgentIcon}"
          src="images/urgent.svg"
          alt="urgency icon">urgent</button>
          <button class="form__button form__button--delete"
          onmouseover="onHoverDelete();"
          onmouseout="offHoverDelete();"><img class="button-image image--delete"
          src="images/delete.svg"
          alt="delete icon">delete</button>
        </form>
      </article>`);
}

function makeHTMLForTasks(todoList) {
    let tasksHTML = '';
    let classes = determineTaskClasses(todoList);
    todoList.tasks.forEach(task => tasksHTML += `<li class="list__item" data-id=${task.id}><span class="item__checkbox ${classes.checkedIcon}"></span><span class="item__paragraph ${classes.checkedText}">${task.text}</span></li>`);
    return tasksHTML;
}

function determineTaskClasses(todoList) {
    classes = {};
    for (i = 0; i < todoList.tasks; i++) {
        if (todoList.tasks[i].isCompleted) {
            classes.checkedIcon = 'item-checked';
            classes.checkedText = 'paragraph-checked';
        } else {
            classes.checkedIcon = '';
            classes.checkedText = '';
        }
    }
    return classes;
}

function determineToDoListClasses(todoList) {
    let classes = {}
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

// On Main Handler
function mainHandler(event) {
    event.preventDefault();
    if (event.target.classList.contains('item__checkbox')) {
        toggleCheckOffTask(event);
        let index = locateTaskIndex(event.target.parentNode);

        // toggleDeleteButton();
    }
    if (event.target.classList.contains('form__button--urgent')) {
        toggleUrgentIcon();
        toggleUrgentCard(event.target);
        let index = locateTodoListIndex(event.target.parentNode.parentNode)
        todoArray[index].isUrgent = !todoArray[index].isUrgent;
        todoArray[index].saveToStorage(todoArray);
    }
}

function toggleCheckOffTask(event) {
    event.target.classList.toggle('item-checked');
    event.target.nextSibling.classList.toggle('paragraph-checked');
}

function toggleUrgentIcon() {
    document.querySelector('.image--urgent').classList.toggle('image--urgent-active');
    document.querySelector('.form__button--urgent').classList.toggle('form__button--urgent-active');
}

function toggleUrgentCard(button) {
    button.parentNode.parentNode.classList.toggle('article--task-cards-urgent')
}

// Hover Function
function onHoverUrgent() {
    toggleUrgentIcon();
}

function offHoverUrgent() {
    toggleUrgentIcon();
}

function onHoverDelete() {
    toggleDelete()
}

function offHoverDelete() {
    toggleDelete()
}

function toggleDelete() {
    if (document.querySelector('.image--delete').classList.contains('image--delete-active')) {
        document.querySelector('.image--delete').classList.remove('image--delete-active');
        document.querySelector('.form__button--delete').classList.remove('form__button--delete-active');
    } else {
        document.querySelector('.image--delete').classList.add('image--delete-active');
        document.querySelector('.form__button--delete').classList.add('form__button--delete-active');
    }
}

// Random functions
function locateTaskIndex(task) {
    let todoList = task.parentNode.parentNode;
    let index = todoList.tasks.findIndex(element => element.id == task.dataset.id);
    return index;
}

function locateTodoListIndex(todoList) {
    let index = todoArray.findIndex(element => element.id == todoList.dataset.id);
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