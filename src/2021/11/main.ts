import { Stack } from '../../stack';
import { Day, Input } from '../../day';
import { Advent, Timed } from '../../decorators';
import { Comparable } from '../../comparable';

interface Octopus {
    energy: number;
    flashed: boolean;
}

class Position implements Comparable {
    constructor(readonly row: number, readonly col: number) { }

    isEqual(other: Position) {
        return this.row === other.row && this.col === other.col;
    }
}

@Advent(2021, 11, false)
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
                    stack.push(new Position(row, col));
                }
            }
        }
    
        // For every octopus in the stack, flash
        while (!stack.isEmpty()) {
            const pos = stack.pop();
    
            const octopus = input[pos.row][pos.col];
    
            // Reset
            octopus.energy = 0;
            octopus.flashed = true;
    
            numFlashes++;
    
            // Check neighbours
            for (let i = pos.row - 1; i <= pos.row + 1; i++) {
                for (let j = pos.col - 1; j <= pos.col + 1; j++) {
                    // Skip current octopus
                    if (i === pos.row && j === pos.col) {
                        continue;
                    }
    
                    const neighbour = input[i]?.[j] ?? null;
    
                    // If neighbour is out of bounds, skip
                    if (!neighbour) {
                        continue;
                    }

                    const curPos = new Position(i, j);
    
                    // If neighbour is already in stack, skip
                    if (stack.contains(curPos)) {
                        continue;
                    }
    
                    // Trigger flash on neighbour if it hasn't already flashed
                    if (!neighbour.flashed) {
                        neighbour.energy++;
    
                        if (neighbour.energy > this.ENERGY_LEVEL) {
                            stack.push(curPos);
                        }
                    }
                }
            }
        }
    
        return numFlashes;
    }
}

new Day11();