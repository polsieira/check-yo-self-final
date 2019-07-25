class TodoList {
    constructor(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.isUrgent = obj.isUrgent || false;
        this.tasks = obj.tasks || [];
    }

    saveToStorage() {

    }

    deleteFromstorage() {

    }

    updateToDo() {

    }

    updateTask() {

    }
}