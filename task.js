class Task {
    constructor(obj) {
        this.id = obj.id;
        this.isCompleted = obj.isCompleted || false;
        this.text = obj.text;
    }
}