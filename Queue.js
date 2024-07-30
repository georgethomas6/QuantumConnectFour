
export default class Queue {
    constructor() {
        this.items = [];
    }

    // Add an item to the end of the queue
    enqueue(item) {
        this.items.push(item);
    }

    // Remove an item from the front of the queue
    pop() {
        return this.items.shift();
    }

    // Peek at the front item without removing it
    peek() {
        return this.items[0];
    }

    // Check if the queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get the size of the queue
    size() {
        return this.items.length;
    }
}