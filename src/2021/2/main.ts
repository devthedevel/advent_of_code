/**
 * @see https://adventofcode.com/2021/day/2
 * 
 * 1. What do you get if you multiply your final horizontal position by your final depth?
 * 1. What do you get if you multiply your final horizontal position by your final depth?
 */

import { parseInput } from '../../index';

enum Command {
    FORWARD = 'forward',
    UP = 'up',
    DOWN = 'down'
}

interface Input {
    command: Command;
    value: number;
}

async function part1(file) {
    const input = await parseInput(file, null, line => {
        const [command, value] = line.split(' ');

        return {
            command,
            value: parseInt(value)
        }
    }) as Input[];

    let depth = 0;
    let position = 0;
    let aim = 0;

    for (const obj of input) {
        switch(obj.command) {
            case Command.FORWARD: {
                position += obj.value;
                depth += (obj.value * aim);
                break;
            }
            case Command.UP: {
                aim -= obj.value;
                break;
            }
            case Command.DOWN: {
                aim += obj.value;
                break;
            }
            default: {
                console.log(`Invalid command: ${obj.command}`);
            }
        }
    }

    console.log(`Current depth: ${depth}`);
    console.log(`Current position: ${position}`);
    console.log(`Product: ${depth * position}`);
}

const file = 'input.txt';
part1(file);