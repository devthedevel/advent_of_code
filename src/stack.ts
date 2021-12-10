export class Stack<T> {
    private readonly arr: T[];

    constructor() {
        this.arr = [];
    }

    push(item: T) {
        this.arr.push(item);
    }

    pop(): T {
        return this.arr.pop();
    }

    peek(): T {
        return this.arr[this.arr.length-1];
    }

    isEmpty(): boolean {
        return this.arr.length === 0;
    }
}