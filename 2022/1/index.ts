type Input = number[][];

export async function input(lines: string[]): Promise<[Input, any]> {
    const input: Input = [];

    let temp: number[] = [];
    lines.forEach((line, i) => {
        if (line === '' || i === lines.length) {
            input.push(temp);
            temp = [];
        } else if (i === lines.length - 1) {
            input.push([Number(line)])
        } else {
            temp.push(Number(line));
        }
    })

    return [input, input]
}

export async function one(input: Input) {
    let max = 0;

    input.forEach(elf => {
        const sum = elf.reduce((acc, curr) => acc + curr, 0);
        if (sum > max) {
            max = sum;
        }
    })

    return max
}

export async function two(input: Input) {
    const summedInput = input.map(elf => elf.reduce((acc, curr) => acc + curr, 0));

    summedInput.sort((a, b) => a - b);

    return summedInput.slice(-3).reduce((acc, curr) => acc + curr, 0)
}