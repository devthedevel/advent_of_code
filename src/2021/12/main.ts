import { Day } from '../../day';
import { Advent, Timed } from '../../decorators';

interface Cave {
    name: string;
    small: boolean;
}

interface Path {
    start: string;
    end: string;
}

type Input = Path[];

@Advent(2021, 12, false)
class Day12 extends Day<Input> {

    @Timed
    transform(data: string[]): Input {
        return data.map(line => {
            const arr = line.split('-');
            
            return {
                start: arr[0],
                end: arr[1]
            }
        });
    }

    @Timed
    one(input: Input) {
        const graph = new Graph<Cave>();

        for (let path of input) {
            graph.addVertex(path.start, {
                name: path.start,
                small: path.start.charAt(0).charAt(0) === path.start.charAt(0).toLowerCase()
            });
            graph.addVertex(path.end, {
                name: path.end,
                small: path.end.charAt(0).charAt(0) === path.end.charAt(0).toLowerCase()
            });
            graph.addEdge(path.start, path.end);
        }

        const paths = [];
        this.walk(graph, [], paths, graph.get('start'));

        console.log(`There are ${paths.length} paths`);
    }

    @Timed
    two(input: Input) {
        const graph = new Graph<Cave>();

        for (let path of input) {
            graph.addVertex(path.start, {
                name: path.start,
                small: path.start.charAt(0).charAt(0) === path.start.charAt(0).toLowerCase()
            });
            graph.addVertex(path.end, {
                name: path.end,
                small: path.end.charAt(0).charAt(0) === path.end.charAt(0).toLowerCase()
            });
            graph.addEdge(path.start, path.end);
        }

        const paths = [];
        this.walkTwo(graph, [], paths, graph.get('start'), false);

        console.log(`There are ${paths.length} paths`);
    }

    walk(graph: Graph<Cave>, visited: Node<Cave>[], paths: string[][], node: Node<Cave>) {
        if (node.value.name === 'end') {
            visited.push(node);
            paths.push(visited.map(item => item.value.name));
            visited.pop();
            return;
        }

        if (node.value.small && visited.includes(node)) {
            return;
        }

        visited.push(node);

        for (let child of node.adjacents) {
            this.walk(graph, visited, paths, child);
        }

        visited.pop();
    }

    walkTwo(graph: Graph<Cave>, visited: string[], paths: string[][], node: Node<Cave>, twiceVisited: boolean) {
        if (node.value.name === 'end') {
            paths.push([...visited, node.value.name]);
            return;
        }

        if (node.value.name === 'start' && visited.includes(node.value.name)) {
            return;
        }

        if (node.value.small && visited.includes(node.value.name)) {
            if (twiceVisited) {
                return
            }

            twiceVisited = true;
        }

        visited.push(node.value.name);

        for (let child of node.adjacents) {
            this.walkTwo(graph, visited, paths, child, twiceVisited);
        }

        visited.pop();
    }
}

new Day12();

class Graph<T> {
    readonly nodes;

    constructor() {
        this.nodes = new Map<string, T>();
    }

    get(name: string) {
        return this.nodes.get(name);
    }

    addVertex(name: string, data: T) {
        if (this.nodes.has(name)) {
            return this.get(name);
        } else {
            const vertex = new Node(data);
            this.nodes.set(name, vertex);
            return vertex;
        }
    }

    addEdge(from: string, to: string): [Node<T>, Node<T>] {
        const start = this.addVertex(from, null);
        const end = this.addVertex(to, null);

        start.addAdjacent(end);
        end.addAdjacent(start);

        return [start, end];
    }
}

class Node<T> {
    readonly adjacents;

    constructor(readonly value: T) {
        this.adjacents = [];
    }

    addAdjacent(node: Node<T>) {
        this.adjacents.push(node);
    }
}