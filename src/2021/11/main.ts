import { parseInput } from '../../';
import { Stack } from '../../stack';

interface Octopus {
    energy: number;
    flashed: boolean;
}

interface Position {
    row: number;
    col: number;
}

const ENERGY_LEVEL = 9;

async function part1(file: string) {
    const input = await parseInput(file, null, line => {
        return line.split('').map(item => {
            return {
                energy: parseInt(item),
                flashed: false
            }
        })
    }) as Octopus[][];

    let numFlashes = 0;

    const steps = 100;

    for (let i = 0; i < steps; i++) {
        numFlashes += flash(input);
    }
    
    console.log(`There are ${numFlashes} flashes after ${steps} steps`);
}

async function part2(file: string) {
    const input = await parseInput(file, null, line => {
        return line.split('').map(item => {
            return {
                energy: parseInt(item),
                flashed: false
            }
        })
    }) as Octopus[][];

    let firstSyncStep = 0;
    let step = 0;

    while (firstSyncStep === 0) {
        // If all octopus flash at once, then its a sync step
        if (flash(input) === input.length * input[0].length) {
            firstSyncStep = step;
        }

        step++;
    }
    
    console.log(`First sync step is ${firstSyncStep + 1}`);
}

function flash(input: Octopus[][]): number {
    let numFlashes = 0;

    const stack = new Stack<Position>();

    for (let row = 0; row < input.length; row++) {
        for (let col = 0; col < input[row].length; col++) {
            const octopus = input[row][col];

            // Reset
            octopus.energy++;
            octopus.flashed = false;

            // Add octopus if ready to flash
            if (octopus.energy > ENERGY_LEVEL) {
                stack.push({ row, col });
            }
        }
    }

    // For every octopus in the stack, flash
    while (!stack.isEmpty()) {
        const { row, col } = stack.pop();

        const octopus = input[row][col];

        // Reset
        octopus.energy = 0;
        octopus.flashed = true;

        numFlashes++;

        // Check neighbours
        for (let i = row-1; i <= row+1; i++) {
            for (let j = col-1; j <= col+1; j++) {
                // Skip current octopus
                if (i === row && j === col) {
                    continue;
                }

                const neighbour = input[i]?.[j] ?? null;

                // If neighbour is out of bounds, skip
                if (!neighbour) {
                    continue;
                }

                // If neighbour is already in stack, skip
                if (stack.contains({ row: i, col: j}, (a, b) => {
                    return a.row === b.row && a.col === b.col;
                })) {
                    continue;
                }

                // Trigger flash on neighbour if it hasn't already flashed
                if (!neighbour.flashed) {
                    neighbour.energy++;

                    if (neighbour.energy > ENERGY_LEVEL) {
                        stack.push({
                            row: i,
                            col: j
                        });
                    }
                }
            }
        }
    }

    return numFlashes;
}

const file = 'input.txt';
part2(file);