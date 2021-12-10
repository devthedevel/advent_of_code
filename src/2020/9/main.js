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

function calculateAnswer(data, preambleSize) {
    for (let currNumIdx = preambleSize; currNumIdx < data.length; currNumIdx++) {
        let isValid = false;

        for (let i = currNumIdx - preambleSize; i < currNumIdx; i++) {
            for (let j = i + 1; j < currNumIdx; j++) {
                if (data[j] + data[i] === data[currNumIdx]) {
                    isValid = true;
                    break;
                }
            }

            if (isValid) {
                break;
            }
        }

        if (isValid) {
            continue;
        } else {
            return data[currNumIdx];
        }
    }
}

function calculateAnswer2(data, target) {
    let set = [];
    let val = 0;
    for (let i = 0; i < data.length; i++) {
        val = data[i];
        for (let j = i + 1; j < data.length; j++) {
            val += data[j];

            if (val === target) {
                for (let k = i; k <= j; k++) {
                    set.push(data[k]);
                }

                break;
            } else if (val > target) {
                break;
            }
        }

        if (val === target) {
            break;
        }
    }

    let min;
    let max;
    set.forEach(num => {
        if (min === undefined) {
            min = num;
        }

        if (max === undefined) {
            max = num;
        }

        if (num < min) {
            min = num;
        }

        if (num > max) {
            max = num;
        }
    })

    return min + max;
}

async function part1() {
    const data = await getFileInput('input.txt');

    const answer = calculateAnswer(data, 25);
    console.log(answer);
}

async function part2() {
    const data = await getFileInput('input.txt');

    const answer = calculateAnswer2(data, 26134589);
    console.log(answer);
}

async function main() {
    // await part1();

    await part2();
}

main();