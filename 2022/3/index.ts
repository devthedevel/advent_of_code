type ItemList = string[];

const LOWER_OFFSET = 96;        // UTF-16 code for 'a' starts at 96
const UPPER_OFFSET = 65 - 27;   // UTF-16 code for 'A' starts at 65, priority offset by 27

function isUppercase(char: string): boolean {
    const _char = char;

    return char === _char.toUpperCase();
}

function getPriority(char: string): number {
    return char.charCodeAt(0) - (isUppercase(char) ? UPPER_OFFSET : LOWER_OFFSET);
}

export function input(lines: string[]): [ItemList[], ItemList[]] {
    const items = lines.map(line => line.split(''));

    return [items, items];
}

export function one(input: ItemList[]): number {
    return input.reduce((acc, curr) => {
        const firstCompartment = new Set([...curr.slice(0, curr.length / 2)]);
        const secondCompartment = new Set([...curr.slice(curr.length / 2)]);

        const common: string[] = [];

        firstCompartment.forEach(item => {
            if (secondCompartment.has(item)) {
                common.push(item);
            }
        })

        return acc + common.reduce((comAcc, comCurr) => {
            return comAcc + getPriority(comCurr);
        }, 0);
    }, 0);
}

export function two(input: ItemList[]): number {
    let sum = 0;
    let numIterations = input.length / 3;

    for (let i = 0; i < numIterations; i++) {
        const idx = i * 3;
        
        const group1 = new Set([...input[idx]]);
        const group2 = new Set([...input[idx + 1]]);
        const group3 = new Set([...input[idx + 2]]);

        let badge = '';
        const common: string[] = [];

        group1.forEach(item => {
            if (group2.has(item)) {
                common.push(item);
            }
        });

        common.forEach(item => {
            if (group3.has(item)) {
                badge = item;
            }
        });

        sum += getPriority(badge);
    }

    return sum;
}