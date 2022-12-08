type Row = number[];
type Grid = Row[];

interface Coord {
    row: number;
    col: number;
}

export async function input(lines: string[]): Promise<[Grid, Grid]> {
    const grid = lines.map(line => line.split('').map(item => Number(item)));

    return [grid, grid];
}

export async function one(input: Grid): Promise<number> {
    // Outer ring is immediately visible
    let visible = (input[0].length * 2) + ((input.length - 2) * 2);

    const inner = getInnerTreeCoords(input);

    inner.forEach(coord => {
        if (
            isVisibleFromUp(input, coord) || 
            isVisibleFromDown(input, coord) || 
            isVisibleFromLeft(input, coord) || 
            isVisibleFromRight(input, coord)
        ) {
            visible++;
        }
    });

    return visible;
}

export async function two(input: Grid): Promise<number> {
    let highestScenicScore = 0;

    const inner = getInnerTreeCoords(input);

    inner.forEach(coord => {
        const score = [
            scenicScoreFromUp(input, coord),
            scenicScoreFromDown(input, coord),
            scenicScoreFromLeft(input, coord),
            scenicScoreFromRight(input, coord)
        ].reduce((prod, curr) => prod * curr, 1);

        if (score > highestScenicScore) {
            highestScenicScore = score;
        }
    });

    return highestScenicScore;
}

function getInnerTreeCoords(grid: Grid): Coord[] {
    const inner: Coord[] = [];

    for (let row = 0; row < grid.length; row++) {
        if (row === 0 || row === grid.length - 1) {
            continue;
        }

        for (let col = 0; col < grid[row].length; col++) {
            if (col === 0 || col === grid[row].length - 1) {
                continue;
            }

            inner.push({ row, col });
        }
    }

    return inner;
}

function isVisibleFromUp(grid: Grid, coord: Coord): boolean {
    let max = 0;
    for (let row = 0; row < coord.row; row++) {
        if (grid[row][coord.col] > max) {
            max = grid[row][coord.col];
        }
    }

    return max < grid[coord.row][coord.col]
}

function isVisibleFromDown(grid: Grid, coord: Coord): boolean {
    let max = 0;
    for (let row = coord.row + 1; row < grid.length; row++) {
        if (grid[row][coord.col] > max) {
            max = grid[row][coord.col];
        }
    }

    return max < grid[coord.row][coord.col]
}

function isVisibleFromLeft(grid: Grid, coord: Coord): boolean {
    let max = 0;
    for (let col = 0; col < coord.col; col++) {
        if (grid[coord.row][col] > max) {
            max = grid[coord.row][col];
        }
    }

    return max < grid[coord.row][coord.col]
}

function isVisibleFromRight(grid: Grid, coord: Coord): boolean {
    let max = 0;
    for (let col = coord.col + 1; col < grid[coord.row].length; col++) {
        if (grid[coord.row][col] > max) {
            max = grid[coord.row][col];
        }
    }

    return max < grid[coord.row][coord.col]
}

function scenicScoreFromUp(grid: Grid, coord: Coord): number {
    let score = 0;

    for (let row = coord.row - 1; row >= 0; row--) {
        score++;

        if (grid[row][coord.col] >= grid[coord.row][coord.col]) {
            break;
        }
    }

    return score;
}

function scenicScoreFromDown(grid: Grid, coord: Coord): number {
    let score = 0;

    for (let row = coord.row + 1; row < grid.length; row++) {
        score++;

        if (grid[row][coord.col] >= grid[coord.row][coord.col]) {
            break;
        }
    }

    return score;
}

function scenicScoreFromLeft(grid: Grid, coord: Coord): number {
    let score = 0;

    for (let col = coord.col - 1; col >= 0; col--) {
        score++;

        if (grid[coord.row][col] >= grid[coord.row][coord.col]) {
            break;
        }
    }

    return score;
}

function scenicScoreFromRight(grid: Grid, coord: Coord): number {
    let score = 0;

    for (let col = coord.col + 1; col < grid[coord.row].length; col++) {
        score++;

        if (grid[coord.row][col] >= grid[coord.row][coord.col]) {
            break;
        }
    }

    return score;
}
