import { Comparable } from './comparable';

export class Stack<T extends Comparable> {
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

    contains(obj: T): boolean {
        for (let item of this.arr) {
            if (item.isEqual(obj)) {
                return true;
            }
        }

        return false;
    }
}