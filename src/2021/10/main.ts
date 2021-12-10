import { parseInput } from "../..";
import { Stack } from '../../stack';

async function part1(file: string) {
    const input = await parseInput(file, null, line => line.split(''));

    const illegal = [];

    for (let line of input) {
        const stack = new Stack();

        let foundIllegal = false;

        for (let char of line) {
            // Opening chunks
            if (char === '(' || char === '[' || char === '{' || char === '<') {
                stack.push(char);

            // Closing chunks
            } else {
                const last = stack.pop();

                if (last === '(' && char !== ')' ||
                    last === '[' && char !== ']' ||
                    last === '{' && char !== '}' ||
                    last === '<' && char !== '>') {
                        illegal.push(char);
                        foundIllegal = true;
                        break;
                }
            }
        }

        // If an illegal character was found, skip the rest of line
        if (foundIllegal) {
            continue;
        }
    }

    let score = 0;

    for (let i of illegal) {
        if (i === ')') {
            score += 3;
        } else if (i === ']') {
            score += 57;
        } else if (i === '}') {
            score += 1197;
        } else if (i === '>') {
            score += 25137;
        }
    }

    console.log(`Score is ${score}`);
}

async function part2(file: string) {
    const input = await parseInput(file, null, line => line.split(''));

    const incompletes = [];

    for (let line of input) {
        const stack = new Stack();

        let foundIllegal = false;

        for (let char of line) {
            // Opening chunks
            if (char === '(' || char === '[' || char === '{' || char === '<') {
                stack.push(char);

            // Closing chunks
            } else {
                const last = stack.pop();

                if (last === '(' && char !== ')' ||
                    last === '[' && char !== ']' ||
                    last === '{' && char !== '}' ||
                    last === '<' && char !== '>') {
                        foundIllegal = true;
                        break;
                }
            }
        }

        // If an illegal character was found, skip the rest of line
        if (foundIllegal) {
            continue;
        }

        // If an incomplete line is found, autocomplete it
        if (!stack.isEmpty()) {            
            const autocomplete = [];

            while (!stack.isEmpty()) {
                const last = stack.pop();

                if (last === '(') {
                    autocomplete.push(')');
                } else if (last === '[') {
                    autocomplete.push(']');
                } else if (last === '{') {
                    autocomplete.push('}');
                } else if (last === '<') {
                    autocomplete.push('>');
                }
            }

            incompletes.push(autocomplete);
        }
    }

    const scores = incompletes.map(arr => {
        let score = 0;

        for (let char of arr) {
            score *= 5;

            if (char === ')') {
                score += 1;
            } else if (char === ']') {
                score += 2;
            } else if (char === '}') {
                score += 3;
            } else if (char === '>') {
                score += 4;
            }
        }

        return score;
    });

    scores.sort((a, b) => a - b);

    const middle = scores[Math.floor(scores.length / 2)];

    console.log(`Middle score is ${middle}`);
}

const file = 'input.txt';
part2(file);