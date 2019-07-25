// Global Variables
let tasks = [];
const header = document.querySelector('.header-container');
const aside = document.querySelector('.make-task-container');
const main = document.querySelector('.task-cards-container');

// Event Listeners
window.addEventListener('onload', loadHandler);
header.addEventListener('keyup', headerHandler);
aside.addEventListener('click', asideHandler);
main.addEventListener('click', mainHandler);

// Functions

function loadHandler(event) {
    if (tasks) {
        reinstantiateTasks();
        populateTasks();
    } else {
        toggleAddTaskMessage();
    }
}

function reinstantiateTasks() {

}

function populateTasks() {

}

function toggleAddTaskMessage() {

}

function headerHandler(event) {
    if (event.target.classList.contains('nav__input--search')) {

    }
}

function asideHandler(event) {
    if (event.target.classList.contains('button--add-task')) {

    }
    if (event.target.classList.contains('button--make-task')) {

    }
    if (event.target.classList.contains('button--clear-all')) {

    }
    if (event.target.classList.contains('button--filter')) {

    }
}

function mainHandler(event) {

}