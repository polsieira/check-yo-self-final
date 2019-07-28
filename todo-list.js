class TodoList {
    constructor(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.isUrgent = obj.isUrgent || false;
        this.tasks = obj.tasks || [];
    }

    saveToStorage(array) {
        localStorage.setItem('todoArray', JSON.stringify(array));
    }

    deleteFromstorage(array) {
        array = array.filter(element => element.id !== this.id);
        localStorage.setItem('todoArray', JSON.stringify(array));
    }

    updateToDo() {

    }

    updateTask() {

    }
}