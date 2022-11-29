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

function parseCmd(line) {
    const arr = line.split(' ')

    return [arr[0], parseInt(arr[1])]
}

function simulateHandheldGame(program) {
    let opIdx = 0;
    let acc = 0;

    const executedCmdIdxs = new Set();

    while (true) {
        if (opIdx > program.length - 1) {
            console.log('TERMINATED')
            return acc;
        }

        const [cmd, param] = parseCmd(program[opIdx])

        console.log(`ACC: ${acc}   | ${cmd} ${param}`)

        if (executedCmdIdxs.has(opIdx)) {
            console.log('INFINITE LOOP DETECTED')
            return null;
        }

        executedCmdIdxs.add(opIdx);

        switch (cmd) {
            case 'nop':
                opIdx++;
                break;
            case 'acc':
                acc += param;
                opIdx++;
                break;
            case 'jmp':
                opIdx += param;
                break;
            default:
                console.log('DEFAULTED')
                opIdx++;
        }
    }
}

function calculateAnswer(data) {
    for (let lineIdx = 0; lineIdx < data.length; lineIdx++) {
        const program = [...data]
        const [cmd, param] = parseCmd(data[lineIdx])

        switch (cmd) {
            case 'nop':
                program[lineIdx] = program[lineIdx].replace('nop', 'jmp');
                break;
            case 'jmp':
                program[lineIdx] = program[lineIdx].replace('jmp', 'nop');
                break;
            default: 
                continue;
        }

        const exitCode = simulateHandheldGame(program)

        if (exitCode) {
            return exitCode
        }
    }
}

function calculateAnswer2(data) {

}

async function part1() {
    const data = await getFileInput('input.txt');

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