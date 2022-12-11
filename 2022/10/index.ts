interface Noop {
    type: 'noop';
}

interface AddX {
    type: 'addx';
    value: number;
}

type Instruction = Noop | AddX;
type InstructionSet = Instruction[];

export function input(lines: string[]): [InstructionSet, InstructionSet] {
    const instructionSet = lines.map(line => {
        const [instr, arg] = line.split(' ');

        if (instr === 'noop') {
            return {
                type: instr
            } as Noop
        } else if (instr === 'addx') {
            return {
                type: instr,
                value: Number(arg)
            } as AddX
        }
    }) as InstructionSet;

    return [[...instructionSet], [...instructionSet]]
}

export function one(input: InstructionSet): number {
    const signalStrengths: number[] = [];

    let cycle = 1;

    const registers: { [reg: string]: number } = {
        X: 1
    };

    let currInstruction: Instruction | undefined | null = null;
    let currInstructionStartCycle = 0;

    while (true) {
        // Get new instruction if needed
        if (!currInstruction) {
            currInstruction = input.shift();

            if (!currInstruction) {
                break;
            }

            currInstructionStartCycle = 0;
        }

        // Record signal strength at 40 cycle intervals, starting at 20
        if (cycle === (cycle - 20) % 40) {
            signalStrengths.push(registers.X * cycle);
        }

        // Process instruction
        if (currInstruction.type === 'noop') {
            currInstruction = null;
        } else if (currInstruction.type === 'addx') {
            if (currInstructionStartCycle === 0) {
                currInstructionStartCycle++;
            } else {
                registers.X += (currInstruction! as AddX).value;
                currInstruction = null;
            }
        }

        cycle++;
    }

    return signalStrengths.reduce((acc, curr) => acc + curr, 0);
}

export function two(input: InstructionSet): number {
    let cycle = 1;

    const registers: { [reg: string]: number } = {
        X: 1
    };

    let currInstruction: Instruction | undefined | null = null;
    let currInstructionStartCycle = 0;

    let crtRow = '';

    while (true) {
        // Print CRT line at 40 cycle intervals
        if (cycle === cycle % 40 + 1) {
            console.log(crtRow);
            crtRow = '';
        }

        // Get new instruction if needed
        if (!currInstruction) {
            currInstruction = input.shift();

            if (!currInstruction) {
                break;
            }

            currInstructionStartCycle = 0;
        }

        // Add pixel to CRT
        if (Math.abs(registers.X - (cycle - 1) % 40) <= 1) {
            crtRow = crtRow.concat('#');
        } else {
            crtRow = crtRow.concat('.');
        }

        // Process instruction
        if (currInstruction.type === 'noop') {
            currInstruction = null;
        } else if (currInstruction.type === 'addx') {
            if (currInstructionStartCycle === 0) {
                currInstructionStartCycle++;
            } else {
                registers.X += (currInstruction! as AddX).value;
                currInstruction = null;
            }
        }

        cycle++;
    }

    return 0;
}