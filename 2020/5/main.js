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

function calcRow(str, minIdx, maxIdx) {
    const character = str.charAt(0)
    const midIdx = Math.floor((maxIdx - minIdx) / 2) + minIdx;

    if (character === 'F') {
        if (str.length === 1) {
            return minIdx;
        }
        return calcRow(str.substring(1), minIdx, midIdx);
    } else if (character === 'B') {
        if (str.length === 1) {
            return maxIdx;
        }
        return calcRow(str.substring(1), midIdx + 1, maxIdx);
    }
}

function calcCol(str, minIdx, maxIdx) {
    const character = str.charAt(0)
    const midIdx = Math.floor((maxIdx - minIdx) / 2) + minIdx;

    if (character === 'L') {
        if (str.length === 1) {
            return minIdx;
        }
        return calcCol(str.substring(1), minIdx, midIdx);
    } else if (character === 'R') {
        if (str.length === 1) {
            return maxIdx;
        }
        return calcCol(str.substring(1), midIdx + 1, maxIdx);
    }
}


function calculateAnswer(data) {
    const passes = [];

    data.forEach(boardingPass => {
        const obj = {
            pass: boardingPass,
            row: calcRow(boardingPass.substring(0, 7), 0, 127),
            col: calcCol(boardingPass.substring(7), 0, 7)
        }

        obj.id = obj.row * 8 + obj.col;

        passes.push(obj);
    });

    let maxId = 0;
    passes.forEach(pass => {
        if (pass.id > maxId) {
            maxId = pass.id;
        }
    })

    return maxId;
}

function calculateAnswer2(data) {
    const passes = [];

    data.forEach(boardingPass => {
        const row = calcRow(boardingPass.substring(0, 7), 0, 127);
        const col = calcCol(boardingPass.substring(7), 0, 7);
        const id = row * 8 + col;

        passes.push(id);
    });

    passes.sort((id1, id2) => {
        return id1 - id2;
    })

    for (let i = 1; i < passes.length - 1; i++) {
        if ((passes[i] - 1 !== passes[i-1])) {
            return passes[i-1];
        }
    }
}

async function part1() {
    const data = await getFileInput('input.txt');

    const answer = calculateAnswer(data);
    // const answer = calculateAnswer(['FBFBBFFRLR']);   //R44, C5, ID 3577
    // const answer = calculateAnswer(['BFFFBBFRRR']);   //R70, C7, ID 567
    // const answer = calculateAnswer(['FFFBBBFRRR']);   //R14, C7, ID 119
    // const answer = calculateAnswer(['BBFFBBFRLL']);   //R102, C4, ID 820

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