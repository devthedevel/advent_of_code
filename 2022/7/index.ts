type FsItem = Directory | File;

interface Directory {
    type: 'dir';
    name: string;
}

interface File {
    type: 'file';
    size: number;
    name: string;
}

export class Node<T> {
    readonly data: T;
    parent: Node<T> | null = null;
    readonly children: Node<T>[] = [];

    constructor(data: T) {
        this.data = data;
    }

    addChild = (node: Node<T>) => {
        node.parent = this;
        this.children.push(node);
    }
}

export async function input(lines: string[]): Promise<[Node<FsItem>, Node<FsItem>]> {
    const root = new Node<FsItem>({
        type: 'dir',
        name: '/'
    });

    let node = root;

    lines.forEach(line => {
        const args = line.split(' ');

        if (args[0] === '$') {
            const [cmd, arg] = args.slice(1);

            if (cmd === 'cd') {
                if (arg === '/') {
                    node = root;
                } else if (arg === '..') {
                    node = node.parent!;
                } else {
                    node = node.children.find(n => n.data.name === arg)!;
                }
            }
        } else if (args[0] === 'dir') {
            const dirName = args.pop()!;

            const dirNode = new Node<FsItem>({
                type: 'dir',
                name: dirName
            })

            node.addChild(dirNode);
        } else {
            const [size, name] = args;

            const fileNode = new Node<FsItem>({
                type: 'file',
                size: Number(size),
                name
            });

            node.addChild(fileNode);
        }
    })

    return [root, root];
}

export async function one(input: Node<FsItem>): Promise<number> {
    const limit = 100000;
    const dirSizeMap = getDirectorySizes(input);

    return Array.from(dirSizeMap.values()).filter(dirSize => dirSize <= limit).reduce((sum, dirSize) => sum + dirSize, 0);
}

export async function two(input: Node<FsItem>): Promise<number> {
    const totalDiskSpace = 70000000;
    const requiredSpace = 30000000;

    const dirSizeMap = getDirectorySizes(input);

    const dirSizeArr = Array.from(dirSizeMap.values()).sort((a, b) => a - b);

    const usedDiskSpace = dirSizeArr.pop()!;
    const unusedDiskSpace = totalDiskSpace - usedDiskSpace;

    const diskSpaceToDelete = requiredSpace - unusedDiskSpace;

    return dirSizeArr.filter(dir => dir >= diskSpaceToDelete)[0];
}

/**
 * because jack and shawn and poseidon complained about re-using a function in a one off script
 */
function getDirectorySizes(root: Node<FsItem>): Map<string, number> {
    const dirSizeMap = new Map<string, number>();

    const walk = (node: typeof root, path: string[] = []): number => {
        if (node.data.type === 'file') {
            return node.data.size;
        }

        if (node.children.length === 0) {
            return 0;
        }

        path.push(node.data.name);

        const sum = node.children.reduce((_sum, child) => _sum + walk(child, path), 0);

        const dirPath = path.join('/')

        dirSizeMap.set(dirPath, sum);

        path.pop();

        return sum
    }

    walk(root);

    return dirSizeMap;
}