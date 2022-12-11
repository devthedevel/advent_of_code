export function input(lines: string[]): [string, string] {
    const input = lines[0]
    return [input, input];
}

export function one(input: string): number {
    const offset = 4;
    let idx = 0;

    for (let i = offset - 1; i < input.length; i++) {
        const set = new Set(input.slice(i - offset + 1, i + 1));

        if (set.size === offset) {
            idx = i + 1;
            break;
        }
    }

    return idx;
}

export function two(input: string): number {
    const offset = 14;
    let idx = 0;

    for (let i = offset - 1; i < input.length; i++) {
        const set = new Set(input.slice(i - offset + 1, i + 1));

        if (set.size === offset) {
            idx = i + 1;
            break;
        }
    }

    return idx;
}