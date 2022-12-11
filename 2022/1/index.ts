type Input = number[][];

export function input(lines: string[]): [Input, Input] {
    const input: Input = [];

    let temp: number[] = [];
    lines.forEach((line, i) => {
        if (line === '' || i === lines.length) {
            input.push(temp);
            temp = [];
        }

        temp.push(Number(line));

        if (i === lines.length - 1) {
            input.push(temp);
        }
    })

    return [input, input]
}

export function one(input: Input): number {
    let max = 0;

    input.forEach(elf => {
        const sum = elf.reduce((acc, curr) => acc + curr, 0);
        if (sum > max) {
            max = sum;
        }
    })

    return max
}

export function two(input: Input): number {
    const summedInput = input.map(elf => elf.reduce((acc, curr) => acc + curr, 0));

    summedInput.sort((a, b) => a - b);

    return summedInput.slice(-3).reduce((acc, curr) => acc + curr, 0)
}