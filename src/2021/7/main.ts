import { parseInput } from '../../index';

async function part1(file) {
    const input = await parseInput(file, ',', num => parseInt(num)) as number[];

    const sorted = input.sort((a, b) => a - b);

    const fuelCosts = [];

    for (let pos = 0; pos < sorted[sorted.length - 1]; pos++) {
        let cost = 0;
        for (let i = 0; i < sorted.length; i++) {
            cost += Math.abs(sorted[i] - pos);
        }

        fuelCosts.push(cost);
    }

    let min = fuelCosts[0];
    let minPos = 0;

    for (let i = 1; i < fuelCosts.length; i++) {

        if (fuelCosts[i] < min) {
            min = fuelCosts[i];
            minPos = i;
        }
    }

    console.log(`Least amount of fuel happens at position ${minPos} with ${min} units of fuel`);
}

async function part2(file: string) {
    const input = await parseInput<number>(file, ',', num => parseInt(num)) as number[];

    const sorted = input.sort((a, b) => a - b);

    const fuelCosts = [];

    for (let pos = 0; pos < sorted[sorted.length - 1]; pos++) {
        let cost = 0;
        for (let i = 0; i < sorted.length; i++) {
            const diff = Math.abs(sorted[i] - pos);
            for (let j = 0; j < diff; j++) {
                cost += j + 1;
            }
        }

        fuelCosts.push(cost);
    }

    let min = fuelCosts[0];
    let minPos = 0;

    for (let i = 1; i < fuelCosts.length; i++) {
        if (fuelCosts[i] < min) {
            min = fuelCosts[i];
            minPos = i;
        }
    }

    console.log(`Least amount of fuel happens at position ${minPos} with ${min} units of fuel`);
}

const file = 'input.txt';
part1(file)