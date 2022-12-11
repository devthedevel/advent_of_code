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

export function input(lines: string[]): [Monkeys, any] {
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


    return [monkeys, monkeys];
}

export function one(input: Monkeys): number {
    const monkeys = JSON.parse(JSON.stringify(input));

    const worryFunc = (worry: number): number => {
        return Math.floor(worry / 3.0);
    }

    return simulate(monkeys, 20, worryFunc);
}

export function two(input: Monkeys): number {
    const monkeys: Monkeys = JSON.parse(JSON.stringify(input));
    const divisor = monkeys.reduce((a, b) => a * b.test.condition, 1);

    const worryFunc = (worry: number): number => {
        return worry % divisor;
    }

    return simulate(monkeys, 10000, worryFunc);
}

function simulate(monkeys: Monkey[], rounds: number, worryFunc: (worry: number) => number): number {
    const inspections: number[] = new Array(monkeys.length).fill(0);

    for (let round = 0; round < rounds; round++) {
        for (let monkeyIdx = 0; monkeyIdx < monkeys.length; monkeyIdx++) {
            const monkey = monkeys[monkeyIdx];

            while (monkey.items.length > 0) {
                const item = monkey.items.shift() as number;

                inspections[monkeyIdx]++;

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

                worry = worryFunc(worry!);

                if (worry % monkey.test.condition === 0) {
                    monkeys[monkey.test.trueResult].items.push(worry!);
                } else {
                    monkeys[monkey.test.falseResult].items.push(worry!);
                }
            }
        }
    }

    return inspections
        .sort((a, b) => b - a)
        .slice(0, 2)
        .reduce((acc, curr) => acc * curr, 1)
}