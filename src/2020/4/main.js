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

function parseData(data) {
    
}

function calculateAnswer(data) {
    const passports = parseData(data)
}

function calculateAnswer2(data) {

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
    await part1();

    // await part2();
}

main();