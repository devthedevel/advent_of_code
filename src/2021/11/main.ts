import { Stack } from '../../stack.js';
import { Day, Input } from '../../day.js';
import { Advent, Timed } from '../../decorators.js';

interface Octopus {
    energy: number;
    flashed: boolean;
}

interface Position {
    row: number;
    col: number;
}

@Advent(2021, 11, true)
class Day11 extends Day<Octopus> {

    ENERGY_LEVEL = 9;

    @Timed
    transform(data: string[]) {
        return data.map(line => {
            return line.split('').map(item => {
                return {
                    energy: parseInt(item),
                    flashed: false
                }
            });
        });
    }

    @Timed
    one(input: Input<Octopus>) {
        let numFlashes = 0;

        const steps = 100;
    
        for (let i = 0; i < steps; i++) {
            numFlashes += this.flash(input);
        }
        
        console.log(`There are ${numFlashes} flashes after ${steps} steps`);
    }

    @Timed
    two(input: Input<Octopus>) {
        let firstSyncStep = 0;
        let step = 0;
    
        while (firstSyncStep === 0) {
            // If all octopus flash at once, then its a sync step
            if (this.flash(input) === input.length * input[0].length) {
                firstSyncStep = step;
            }
    
            step++;
        }
        
        console.log(`First sync step is ${firstSyncStep + 1}`);
    }

    flash(input: Input<Octopus>): number {
        let numFlashes = 0;
    
        const stack = new Stack<Position>();
    
        for (let row = 0; row < input.length; row++) {
            for (let col = 0; col < input[row].length; col++) {
                const octopus = input[row][col];
    
                // Reset
                octopus.energy++;
                octopus.flashed = false;
    
                // Add octopus if ready to flash
                if (octopus.energy > this.ENERGY_LEVEL) {
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
    
                        if (neighbour.energy > this.ENERGY_LEVEL) {
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
}

new Day11();