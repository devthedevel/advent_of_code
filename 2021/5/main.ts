import { parseInput } from '../../index';

interface Point {
    x: number;
    y: number;
}

interface Line {
    start: Point;
    end: Point;
}

function xLength(line) {
    return line.end.x - line.start.x;
}

function yLength(line) {
    return line.end.y - line.start.y;
}

function isHorizontal(line) {
    return line.start.y === line.end.y;
}

function isVertical(line) {
    return line.start.x === line.end.x;
}

function isDiagonal(line) {
   return !(isHorizontal(line) || isVertical(line));
}

function countOverlappingPoints(map, threshold) {
    let count = 0;

    for (let y = 0; y < map.length; y++) {
        if (!map[y]) continue;

        for (let x = 0; x < map[y].length; x++) {
            const point = map[y][x];

            if (point && point >= threshold) {
                count++;
            }
        }
    }

    return count;
}

async function part1(file) {
    const lines = await parseInput(file, null, line => {
        const points = line.split('->');

        const start = points[0].replace(' ', '').split(',');
        const end = points[1].replace(' ', '').split(',');

        return {
            start: {
                x: parseInt(start[0]),
                y: parseInt(start[1])
            },
            end: {
                x: parseInt(end[0]),
                y: parseInt(end[1])
            }
        }
    }) as Line[];

    const map = [];

    for (let line of lines) {
        let x = line.start.x;
        let y = line.start.y;

        const length = Math.abs(isDiagonal(line) || isHorizontal(line) ? xLength(line) : yLength(line));

        const xDirection = xLength(line)/(Math.abs(xLength(line)));
        const yDirection = yLength(line)/(Math.abs(yLength(line)));

        for (let i = 0; i <= length; i++) {
            if (!map[y]) {
                map[y] = [];
            }

            if (!map[y][x]) {
                map[y][x] = 1;
            } else {
                map[y][x]++;
            }

            x += Number.isNaN(xDirection) ? 0 : xDirection;
            y += Number.isNaN(yDirection) ? 0 : yDirection;
        }
    }

    const threshold = 2;
    const numOverlappingPoints = countOverlappingPoints(map, threshold);

    console.log(`Number of overlapping points with a threshold of ${threshold}: ${numOverlappingPoints}`);
}

const file = 'input.txt';
part1(file);