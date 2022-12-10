interface Noop {
    type: 'noop';
}

interface AddX {
    type: 'addx';
    value: number;
}

type Instruction = Noop | AddX;
type InstructionSet = Instruction[];

export async function input(lines: string[]): Promise<[InstructionSet, InstructionSet]> {
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

export async function one(input: InstructionSet): Promise<number> {

    const cycleBreakpoints: number[] = [20, 60, 100, 140, 180, 220]
    const signalStrengths: number[] = [];

    let cycle = 1;

    const registers: { [reg: string]: number } = {
        X: 1
    };

    let currInstr: Instruction | undefined | null = null;
    let instStartCycle = 0;

    while (true) {
        if (!currInstr) {
            currInstr = input.shift()

            if (!currInstr) {
                break;
            }

            instStartCycle = 0;
        }

        if (cycle === cycleBreakpoints[0]) {
            signalStrengths.push(registers.X * cycle);
            cycleBreakpoints.shift()
        }

        if (currInstr.type === 'noop') {
            currInstr = null;
        } else if (currInstr.type === 'addx') {
            if (instStartCycle === 0) {
                instStartCycle++;
            } else {
                registers.X += (currInstr! as AddX).value;
                currInstr = null;
            }
        }

        cycle++;
    }

    return signalStrengths.reduce((acc, curr) => acc + curr, 0);
}

export async function two(input: InstructionSet): Promise<number> {
    const cycleBreakpoints: number[] = [40, 80, 120, 160, 200, 240]

    let cycle = 1;

    const registers: { [reg: string]: number } = {
        X: 1
    };

    let currInstr: Instruction | undefined | null = null;
    let instStartCycle = 0;

    let crtRow = '';

    while (true) {
        if (cycle === cycleBreakpoints[0] + 1) {
            cycleBreakpoints.shift();
            console.log(crtRow);
            crtRow = '';
        }

        if (!currInstr) {
            currInstr = input.shift()

            if (!currInstr) {
                break;
            }

            instStartCycle = 0;
        }

        if (Math.abs(registers.X - (cycle - 1) % 40) <= 1) {
            crtRow = crtRow.concat('#')
        } else {
            crtRow = crtRow.concat('.')
        }

        if (currInstr.type === 'noop') {
            currInstr = null;
        } else if (currInstr.type === 'addx') {
            if (instStartCycle === 0) {
                instStartCycle++;
            } else {
                registers.X += (currInstr! as AddX).value;
                currInstr = null;
            }
        }

        cycle++;
    }

    return 0;
}