/**
 * @see https://adventofcode.com/2021/day/10
 * 
 * 1. What is the total syntax error score for those errors?
 * 2. What is the middle score?
 */

import { parseInput } from '../..';
import { Stack } from '../../stack';

enum Openers {
    CIRCLE = '(',
    SQUARE = '[',
    CURLY = '{',
    ANGLE = '<'    
}

enum Closers {
    CIRCLE = ')',
    SQUARE = ']',
    CURLY = '}',
    ANGLE = '>'
}

async function part1(file: string) {
    const input = await parseInput(file, null, line => line.split(''));

    const illegal = [];

    outer:
    for (let line of input) {
        const stack = new Stack();

        for (let char of line) {
            // Opening chunks
            if (char === Openers.CIRCLE || 
                char === Openers.SQUARE || 
                char === Openers.CURLY || 
                char === Openers.ANGLE) {
                stack.push(char);

            // Closing chunks
            } else {
                const last = stack.pop();

                if (last === Openers.CIRCLE && char !== Closers.CIRCLE ||
                    last === Openers.SQUARE && char !== Closers.SQUARE ||
                    last === Openers.CURLY && char !== Closers.CURLY ||
                    last === Openers.ANGLE && char !== Closers.ANGLE) {
                        illegal.push(char);
                        break outer;
                }
            }
        }
    }

    const scoreMap = { };
    scoreMap[Closers.CIRCLE] = 3;
    scoreMap[Closers.SQUARE] = 57;
    scoreMap[Closers.CURLY] = 1197;
    scoreMap[Closers.ANGLE] = 25137;

    let score = 0;

    for (let char of illegal) {
        score += scoreMap[char];
    }

    console.log(`Score is ${score}`);
}

async function part2(file: string) {
    const input = await parseInput(file, null, line => line.split(''));

    const incompletes = [];

    outer:
    for (let line of input) {
        const stack = new Stack();

        for (let char of line) {
            // Opening chunks
            if (char === Openers.CIRCLE || 
                char === Openers.SQUARE || 
                char === Openers.CURLY || 
                char === Openers.ANGLE) {
                stack.push(char);

            // Closing chunks
            } else {
                const last = stack.pop();

                if (last === Openers.CIRCLE && char !== Closers.CIRCLE ||
                    last === Openers.SQUARE && char !== Closers.SQUARE ||
                    last === Openers.CURLY && char !== Closers.CURLY ||
                    last === Openers.ANGLE && char !== Closers.ANGLE) {
                        break outer;
                }
            }
        }

        // If an incomplete line is found, autocomplete it
        if (!stack.isEmpty()) {            
            const autocomplete = [];

            while (!stack.isEmpty()) {
                const last = stack.pop();

                if (last === Openers.CIRCLE) {
                    autocomplete.push(Closers.CIRCLE);
                } else if (last === Openers.SQUARE) {
                    autocomplete.push(Closers.SQUARE);
                } else if (last === Openers.CURLY) {
                    autocomplete.push(Closers.CURLY);
                } else if (last === Openers.ANGLE) {
                    autocomplete.push(Closers.ANGLE);
                }
            }

            incompletes.push(autocomplete);
        }
    }

    const scoreMap = { };
    scoreMap[Closers.CIRCLE] = 1;
    scoreMap[Closers.SQUARE] = 2;
    scoreMap[Closers.CURLY] = 3;
    scoreMap[Closers.ANGLE] = 4;

    const scores = incompletes.map(arr => {
        let score = 0;

        for (let char of arr) {
            score *= 5;

            score += scoreMap[char];
        }

        return score;
    });

    scores.sort((a, b) => a - b);

    const middle = scores[Math.floor(scores.length / 2)];

    console.log(`Middle score is ${middle}`);
}

const file = 'input.txt';
part2(file);