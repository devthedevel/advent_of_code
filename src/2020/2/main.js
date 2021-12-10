import * as fs from 'fs';
import * as readline from 'readline';

async function getFileInput(file) {
    const stream = fs.createReadStream(file);

    const rl = readline.createInterface({
        input: stream
    });

    const data = [];
    for await (const line of rl) {
        data.push(line);
    }

    return data;
}

function parseLine(line) {
    const splitArr = line.split(' ');
    const minMaxArr = splitArr[0].split('-');

    return {
        min: parseInt(minMaxArr[0]),
        max: parseInt(minMaxArr[1]),
        letter: splitArr[1].replace(':', ''),
        password: splitArr[2]
    }
}

function processObj(obj) {
    let count = 0;
    for (let idx = 0; idx < obj.password.length; idx++) {
        if (obj.password.charAt(idx) === obj.letter) {
            count++
        }
    }

    return count < obj.min ? 0 : count > obj.max ? 0 : 1
}

function processObj2(obj) {
    let valid = false;

    if (obj.password.charAt(obj.min-1) === obj.letter) {
        valid = !valid;
    }

    if (obj.password.charAt(obj.max-1) === obj.letter) {
        valid = !valid;
    }

    return valid ? 1 : 0
}

function calculateAnswer(data) {
    let sum = 0;
    data.forEach(line => {
        const obj = parseLine(line)
        sum += processObj(obj)
    })

    return sum;
}

function calculateAnswer2(data) {
    let sum = 0;
    data.forEach(line => {
        const obj = parseLine(line)
        sum += processObj2(obj)
    })

    return sum;
}

async function part1() {
    const data = await getFileInput('sample_input.txt');

    const answer = calculateAnswer(data);

    console.log(answer);
}

async function part2() {
    const data = await getFileInput('input.txt');

    const answer = calculateAnswer2(data);
    console.log(answer);
}

async function main() {
    // await part1();

    await part2();
}

main();