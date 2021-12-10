/**
 * @see https://adventofcode.com/2021/day/3
 * 
 * 1. What is the power consumption of the submarine?
 */

 import { readFile } from 'fs/promises';
 import { StringDecoder } from 'string_decoder';
 import { EOL } from 'os';
 
 async function getInput(file) {
     const buffer = await readFile(file);
     const decoder = new StringDecoder();
 
     return decoder.write(buffer).split(EOL);
 }

 async function part1(file) {
    const input = await getInput(file);

    const bitMapArr = [];

    for (const binary of input) {
        for (let i = 0; i < binary.length; i++) {
            if (!bitMapArr[i]) {
                bitMapArr.push({0: 0, 1: 0})
            }

            bitMapArr[i][binary.charAt(i)]++;
        }
    }

    let gamma = '';
    let epsilon = '';

    for (const obj of bitMapArr) {
        if (obj[0] > obj[1]) {
            gamma = gamma.concat('0');
            epsilon = epsilon.concat('1');
        } else {
            gamma = gamma.concat('1');
            epsilon = epsilon.concat('0');
        }
    }

    console.log(`Gamma: ${gamma}`);
    console.log(`Epsilon: ${epsilon}`);

    console.log(`Power consumption: ${parseInt(gamma, 2) * parseInt(epsilon, 2)}`)
 }

async function part2(file) {
    const input = await getInput(file);

    const oxygen = process(oxygenFilterFn, 0, input);
    const co2 = process(co2FilterFn, 0, input);

    console.log(`Oxygen: ${oxygen}`);
    console.log(`CO2: ${co2}`);

    console.log(`Life support: ${parseInt(oxygen, 2) * parseInt(co2, 2)}`)
 }

function process(bitFilterFn, bit, input) {
    if (input.length === 1) {
        return input[0];
    }

    const bitMap = {
        0: 0,
        1: 0
    };

    for (let i = 0; i < input.length; i++) {
        bitMap[input[i].charAt(bit)]++;
    }

    const commonBit = bitFilterFn(bitMap[0], bitMap[1]);
    const filteredInput = input.filter(str => str.charAt(bit) === commonBit);

    return process(bitFilterFn, ++bit, filteredInput);
}

function oxygenFilterFn(bit0, bit1) {
    return bit0 === bit1 ? '1' : (bit0 > bit1 ? '0' : '1');
}

function co2FilterFn(bit0, bit1) {
    return bit0 === bit1 ? '0' : (bit0 > bit1 ? '1' : '0');
}

const file = '3/input.txt';
part2(file);