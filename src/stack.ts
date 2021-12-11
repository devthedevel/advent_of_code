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

    contains(obj: T, fn: (a: T, b: T) => boolean): boolean {
        let found = false;

        for (let item of this.arr) {
            found = fn(item, obj);

            if (found) {
                return true;
            }
        }

        return found;
    }
}