import { readFile } from 'fs/promises';
import { StringDecoder } from 'string_decoder';
import { EOL } from 'os';

async function getInput(file) {
    const buffer = await readFile(file);
    const decoder = new StringDecoder();

    const data = decoder.write(buffer).split(EOL);

    const numbers = data.shift().split(',').map(num => parseInt(num));
    const boards = [];

    let boardIdx = 0;

    for (let i = 1; i < data.length; i++) {
        if (data[i] === '') {
            boardIdx++;
            continue;
        };

        if (!boards[boardIdx]) {
            boards[boardIdx] = [];
        }

        const row = data[i].split(' ').filter(num => num !== '').map(num => {
            return {
                value: parseInt(num),
                marked: false
            }
        });

        boards[boardIdx].push(row);
    }

    return [numbers, boards];
}

function markNumber(board, number) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col].value === number) {
                board[row][col].marked = true;
            }
        }
    }
}

function checkBoard(board) {
    // Check rows
    for (let row = 0; row < board.length; row++) {
        let rowWin = true;
        for (let col = 0; col < board.length; col++) {
            if (!board[row][col].marked) {
                rowWin = false;
                break;
            }
        }

        if (rowWin) return true;
    }

    // Check cols
    for (let col = 0; col < board.length; col++) {
        let colWin = true;
        for (let row = 0; row < board.length; row++) {
            if (!board[row][col].marked) {
                colWin = false;
                break;
            }
        }

        if (colWin) return true;
    }

    return false;
}

function getBoardScore(board) {
    let sum = 0;

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            if (!board[row][col].marked) {
                sum += board[row][col].value
            }
        }
    }

    return sum;
}

async function part1(file) {
    const [numbers, boards] = await getInput(file);

    let winningNum;
    let winningBoard;

    for (let num of numbers) {
        if (winningBoard) {
            break;
        }

        for (let board of boards) {
            markNumber(board, num);

            if (checkBoard(board)) {
                winningNum = num;
                winningBoard = board;
                break;
            }
        }
    }

    const score = getBoardScore(winningBoard);

    console.log(`Score: ${score}`);
    console.log(`Winning number: ${winningNum}`);
    console.log(`Product: ${score * winningNum}`);
}

async function part2(file) {
    const[numbers, boards] = await getInput(file);

    let winningNum;
    const winningBoards = [];

    for (let num of numbers) {
        if (winningBoards.length === boards.length) {
            break;
        }

        for (let i = 0; i < boards.length; i++) {
            const board = boards[i];

            markNumber(board, num);

            if (!winningBoards.includes(i) && checkBoard(board)) {
                winningBoards.push(i);
                winningNum = num;
            }

            if (winningBoards.length === boards.length) {
                break;
            }
        }
    }

    const lastBoard = boards[winningBoards[winningBoards.length - 1]];

    const score = getBoardScore(lastBoard);

    console.log(`Score: ${score}`);
    console.log(`Winning number: ${winningNum}`);
    console.log(`Product: ${score * winningNum}`);
}

const file = '4/input.txt';
part2(file)