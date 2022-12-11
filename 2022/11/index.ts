interface Monkey {
    items: number[];
    operation: {
        arg1: string;
        op: string;
        arg2: string;
    },
    test: {
        condition: number;
        trueResult: number;
        falseResult: number;
    }
}

type Monkeys = Monkey[];

export async function input(lines: string[]): Promise<[Monkeys, any]> {
    const monkeys: Monkeys = [];

    let monkeyIdx = 0;

    lines.forEach(line => {
        const args = line
            .split(' ')
            .map(arg => arg.trim().replace(':', '').replace(',', ''))
            .filter(arg => arg !== '');

        if (args[0] === 'Monkey') {
            monkeyIdx = Number(args[1]);

            if (!monkeys[monkeyIdx]) {
                monkeys[monkeyIdx] = { } as Monkey
            }
        } else if (args[0] === 'Starting') {
            monkeys[monkeyIdx].items = [...args.slice(2).map(item => Number(item))];
        } else if (args[0] === 'Operation') {
            monkeys[monkeyIdx].operation = {
                arg1: args[3],
                op: args[4],
                arg2: args[5]
            }
        } else if (args[0] === 'Test') {
            if (!monkeys[monkeyIdx].test) {
                monkeys[monkeyIdx].test = { } as Monkey['test']
            }

            monkeys[monkeyIdx].test.condition = Number(args[3])
        } else if (args[0] === 'If') {
            if (!monkeys[monkeyIdx].test) {
                monkeys[monkeyIdx].test = { } as Monkey['test']
            }

            if (args[1] === 'true') {
                monkeys[monkeyIdx].test.trueResult = Number(args[5]);
            } else if (args[1] === 'false') {
                monkeys[monkeyIdx].test.falseResult = Number(args[5]);
            }
        }
    })


    return [monkeys, null];
}

export async function one(input: Monkeys): Promise<number> {
    const inspections: number[] = [101, 95, 7, 105];
    const numRounds = 20;

    for (let round = 0; round < numRounds; round++) {
        for (let monkeyIdx = 0; monkeyIdx < input.length; monkeyIdx++) {
            const monkey = input[monkeyIdx];

            while (monkey.items.length > 0) {
                const item = monkey.items.shift() as number;

                let arg1: number;
                let arg2: number;
                let worry: number;

                if (monkey.operation.op === '*') {
                    if (monkey.operation.arg1 === 'old') {
                        arg1 = item;
                    } else {
                        arg1 = Number(monkey.operation.arg1);
                    }

                    if (monkey.operation.arg2 === 'old') {
                        arg2 = item;
                    } else {
                        arg2 = Number(monkey.operation.arg2);
                    }

                    worry = arg1! * arg2!;
                } else if (monkey.operation.op === '+') {
                    if (monkey.operation.arg1 === 'old') {
                        arg1 = item;
                    } else {
                        arg1 = Number(monkey.operation.arg1);
                    }

                    if (monkey.operation.arg2 === 'old') {
                        arg2 = item;
                    } else {
                        arg2 = Number(monkey.operation.arg2);
                    }

                    worry = arg1! + arg2!;
                }

                worry = Math.floor(worry! / 3);

                if (worry % monkey.test.condition === 0) {
                    input[monkey.test.trueResult].items.push(worry);
                } else {
                    input[monkey.test.falseResult].items.push(worry);
                }
            }
        }
    }

    return inspections
        .sort((a, b) => b - a)
        .slice(0, 2)
        .reduce((acc, curr) => acc * curr, 1)
}

export async function two(input: any): Promise<number> {
    throw new Error('Unimplemented');
}