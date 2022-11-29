import * as fs from 'fs';
import * as readline from 'readline';

async function getFileInput(file) {
    const stream = fs.createReadStream(file);

    const rl = readline.createInterface({
        input: stream
    });

    const data = [];
    for await (const line of rl) {
        data.push(parseInt(line));
    }

    return data;
}

function calculateAnswer(targetSum, data) {
    let answer;
    for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
            if (data[i] + data[j] === targetSum) {
                answer = data[i] * data[j];
            }
        }
    }

    return answer;
}

function calculateAnswer2(targetSum, data) {
    let answer;
    for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
            for (let k = j + 1; k < data.length; k++) {
                if (data[i] + data[j] + data[k] === targetSum) {
                    answer = data[i] * data[j] * data[k];
                }
            }
        }
    }

    return answer;
}

async function part1(file, targetSum) {
    const data = await getFileInput(file);
    const answer = calculateAnswer(targetSum, data);
    console.log(`The answer is ${answer}`);
}

async function part2(file, targetSum) {
    const data = await getFileInput(file);
    const answer = calculateAnswer2(targetSum, data);
    console.log(`The answer is ${answer}`);
}

async function main() {
    // await part1('input.txt', 2020);

    await part2('input.txt', 2020);
}

main();