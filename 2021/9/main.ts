import { parseInput } from '../../index';

type Key = `${number}|${number}`;

interface Point {
    row: number;
    col: number;
}

function getLowPoints(map: number[][]): Point[] {
    const lowPoints = [];

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            let low = map[row][col];

            // Top row
            if (row === 0) {
                // Top left corner
                if (col === 0) {
                    if (low < map[row][col+1] &&
                        low < map[row+1][col]) {
                            lowPoints.push({row, col});
                        }
                // Top right corner
                } else if (col === map[row].length - 1) {
                    if (low < map[row][col-1] &&
                        low < map[row+1][col]) {
                            lowPoints.push({row, col});
                        }
                } else {
                    if (low < map[row][col-1] &&
                        low < map[row+1][col] &&
                        low < map[row][col+1]) {
                            lowPoints.push({row, col});
                        }
                }
            // Bottom row
            } else if (row === map.length - 1) {
                // Bottom left corner
                if (col === 0) {
                    if (low < map[row][col+1] &&
                        low < map[row-1][col]) {
                            lowPoints.push({row, col});
                        }
                // Bottom right corner
                } else if (col === map[row].length - 1) {
                    if (low < map[row][col-1] &&
                        low < map[row-1][col]) {
                            lowPoints.push({row, col});
                        }
                } else {
                    if (low < map[row][col-1] &&
                        low < map[row-1][col] &&
                        low < map[row][col+1]) {
                            lowPoints.push({row, col});
                        }
                }
            } else {
                // Left column
                if (col === 0) {
                    if (low < map[row-1][col] &&
                        low < map[row][col+1] &&
                        low < map[row+1][col]) {
                        lowPoints.push({row, col});
                    }
                // Right column
                } else if (col === map[row].length - 1) {
                    if (low < map[row-1][col] &&
                        low < map[row][col-1] &&
                        low < map[row+1][col]) {
                        lowPoints.push({row, col});
                    }
                } else {
                    if (low < map[row-1][col] &&
                        low < map[row][col-1] &&
                        low < map[row][col+1] && 
                        low < map[row+1][col]) {
                        lowPoints.push({row, col});
                    }
                }
            }
        }
    }

    return lowPoints;
}

async function part1(file: string) {
    const input = await parseInput(file, null) as string[];

    const map = [];

    for (let line of input) {
        map.push(line.split('').map(item => parseInt(item)))
    }

    const lowPoints = getLowPoints(map);

    let riskLevel = 0;
    for (let point of lowPoints) {
        riskLevel += map[point.row][point.col] + 1;
    }

    console.log(riskLevel);
}

async function part2(file: string) {
    const input = await parseInput(file, null) as string[];

    const map = [];

    for (let line of input) {
        map.push(line.split('').map(item => parseInt(item)))
    }

    const lowPoints = getLowPoints(map);
    const basins = [];

    for (let low of lowPoints) {
        // Track which points we have already visited
        const visited = new Set();

        // Populate the stack with the current low point
        const stack = [low];

        // Track which point values are in the basin
        const basin = [];

        while (stack.length > 0) {
            const point = stack.pop();

            const key = getKey(point);

            if (visited.has(key)) {
                continue;
            }

            const val = map[point.row]?.[point.col] ?? null;

            // Skip if its invalid point (out of bounds)
            if (val === null) {
                continue;
            }

            // Skip if highest height
            if (val === 9) {
                continue;
            }

            // Skip if the previous point is not exactly 1 less than current point
            if (basin.length > 0 && val !== basin[basin.length - 1] + 1) {
                continue;
            }

            // Point is valid, add to visited and basin
            basin.push(val);
            visited.add(key);

            // Add the top, right, bottom, left points respective to the current point
            stack.push({row: point.row - 1, col: point.col});
            stack.push({row: point.row, col: point.col + 1});
            stack.push({row: point.row + 1, col: point.col});
            stack.push({row: point.row, col: point.col - 1});
        }

        basins.push(basin);
    }

    // Sort in descending order
    basins.sort((a, b) => b.length - a.length);

    let product = 1;

    for (let i = 0; i < 3; i++) {
        product *= basins[i].length;
    }

    console.log(`The product of the three largest basins is ${product}`);
}

function getKey(point: Point): Key {
    return `${point.row}|${point.col}`
}

const file = 'input.txt';
part2(file);