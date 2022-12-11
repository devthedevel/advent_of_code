type Crate = string;
type Stack = Crate[];
type Stacks = Stack[];

interface Procedure {
    quantity: number;
    from: number;
    to: number;
}

interface Input {
    stacks: Stacks;
    procedures: Procedure[];
}

export function input(lines: string[]): [Input, Input] {
    const input: Input = {
        stacks: [],
        procedures: []
    };

    const lineStackIdx = lines.findIndex(line => line.startsWith(' 1'));

    // Parse stacks
    for (let lineIdx = lineStackIdx - 1; lineIdx >= 0; lineIdx--) {
        const line = lines[lineIdx];

        for (let i = 0; i < line.length; i += 4) {
            if (line.charAt(i) !== '[') {
                continue;
            }

            const stackIdx = (i / 4) + 1;

            if (!input.stacks[stackIdx]) {
                input.stacks[stackIdx] = [];
            }

            input.stacks[stackIdx].push(line.substring(i + 1, i + 2))
        }
    }

    // Parse procedures
    for (let lineIdx = lineStackIdx + 2; lineIdx <= lines.length; lineIdx++) {
        const line = lines[lineIdx];

        const regex = /move ([\d]+) from ([\d]+) to ([\d]+)/g;

        const result = regex.exec(line);

        if (!result) {
            console.warn(`Could not parse line ${lineIdx}: ${line}`)
            continue;
        }

        input.procedures.push({
            quantity: Number(result[1]),
            from: Number(result[2]),
            to: Number(result[3])
        });
    }

    const clone = JSON.parse(JSON.stringify(input));

    return [input, clone]
}

export function one(input: Input): string {
    const result: string[] = [];

    input.procedures.forEach(proc => {
        const cargo = input.stacks[proc.from].splice(-proc.quantity);

        input.stacks[proc.to].push(...cargo.reverse());
    });

    input.stacks.filter(stack => stack).forEach(stack => result.push(stack.at(-1) as string))

    return result.join('');
}

export function two(input: Input): string {
    const result: string[] = [];

    input.procedures.forEach(proc => {
        const cargo = input.stacks[proc.from].splice(-proc.quantity);

        input.stacks[proc.to].push(...cargo);
    });

    input.stacks.filter(stack => stack).forEach(stack => result.push(stack.at(-1) as string))

    return result.join('');
}