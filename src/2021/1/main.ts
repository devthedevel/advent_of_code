/**
 * @see https://adventofcode.com/2021/day/1
 * 
 * 1. How many measurements are larger than the previous measurement?
 * 2. How many sums are larger than the previous sum?
 */

import { parseInput } from '../../index';

async function part1(file: string) {
    const input = await parseInput(file, null, item => parseInt(item.replace('\r', ''))) as number[];

    console.log(`There are ${input.length} measurements`);

    let count = 0;
    for (let i = 1; i < input.length; i++) {
        if (input[i] > input[i-1]) {
            count++;
        }
    }

    console.log(`Number of measurement increments: ${count}`);
}

async function part2(file) {
    const input = await parseInput(file, null, item => parseInt(item.replace('\r', ''))) as number[];

    console.log(`There are ${input.length} measurements`);

    const groups = [];

    for (let i = 2; i < input.length; i++) {
        groups.push(input[i] + input[i-1] + input[i-2]);
    }

    console.log(`There are ${groups.length} sums of 3`);

    let count = 0;
    for (let i = 1; i < groups.length; i++) {
        if (groups[i] > groups[i-1]) {
            count++;
        }
    }

    console.log(`Number of measurement increments: ${count}`);
}


const file = 'input.txt';
part1(file);