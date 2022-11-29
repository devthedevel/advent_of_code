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

function calcGroups(data) {
    const groups = [];

    let group = new Set()
    for (let lineIdx = 0; lineIdx < data.length; lineIdx++) {
        const line = data[lineIdx]

        if (line === '' && group.size !== 0) {
            groups.push(group)
            group = new Set()
        }

        for (let charIdx = 0; charIdx < line.length; charIdx++) {
            const character = line.charAt(charIdx);

            group.add(character)
        }
    }

    groups.push(group)

    return groups;
}

function calcGroups2(data) {
    const groups = [];

    let group = { }
    for (let lineIdx = 0; lineIdx < data.length; lineIdx++) {
        const line = data[lineIdx]

        if (group.__count === undefined) {
            group.__count = 0
        }

        if (line === '') {
            groups.push(group)
            group = { }
        } else {
            group.__count = group.__count + 1
        }

        for (let charIdx = 0; charIdx < line.length; charIdx++) {
            const character = line.charAt(charIdx);

            if (group[character] === undefined) {
                group[character] = 0
            }

            group[character] = group[character] + 1
        }
    }

    groups.push(group)

    return groups;
}


function calculateAnswer(data) {
    const groups = calcGroups(data);

    let sum = 0;
    groups.forEach(group => {
        sum += group.size
    })

    return sum;
}

function calculateAnswer2(data) {
    const groups = calcGroups2(data)

    let sum = 0;
    groups.forEach(group => {
        Object.keys(group).forEach(key => {
            if (key === '__count') {
                return
            }

            if (group[key] === group.__count) {
                sum += 1
            }
        })
    })

    return sum;
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
    // await part1();

    await part2();
}

main();