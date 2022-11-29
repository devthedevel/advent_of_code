export class Node<T> {
    readonly data: T;
    readonly children: Node<T>[];

    constructor(data: T) {
        this.data = data;
        this.children = [];
    }

    addChild(data: T): Node<T> {
        const child = new Node(data);
        this.children.push(child);
        return child;
    }

    walk(): T[][] {
        const arr = [];
        const stack = [];

        this._walk(this, arr, stack);
        return arr;
    }

    private _walk(node: Node<T>, arr: any[], stack: T[]) {
        if (node.children.length === 0) {
            arr.push([...stack, node.data]);
            return;
        }

        stack.push(node.data);

        for (let child of node.children) {
            this._walk(child, arr, stack);
        }

        stack.pop();
    }
}