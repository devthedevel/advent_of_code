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

function calcSlopes(data, slope) {
    const width = data[0].length
    let trees = 0
    let acc = 0

    for (let y = slope.y; y < data.length; y += slope.y) {
        acc += slope.x
        const x = acc % width 
        if (data[y].charAt(x) === '#') {
            trees++
        }
    }

    return trees
}

function calculateAnswer(data) {
    const slopes = [
        {x: 1, y: 1},
        {x: 3, y: 1},
        {x: 5, y: 1},
        {x: 7, y: 1},
        {x: 1, y: 2}
    ]

    let product = 1
    slopes.forEach(slope => {
        product *= calcSlopes(data, slope)
    })

    return product
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