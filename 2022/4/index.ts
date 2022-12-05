interface Assignment {
    from: number;
    to: number;
}

type Pair = [Assignment, Assignment]

export async function input(lines: string[]): Promise<[Pair[], any]> {
    const pairs = lines.map(line => {
        const assignments = line.split(',');

        const first = assignments[0].split('-');
        const second = assignments[1].split('-');

        return [
            {
                from: Number(first[0]),
                to: Number(first[1])
            },
            {
                from: Number(second[0]),
                to: Number(second[1])
            }
        ]
    });

    // @ts-ignore
    return [pairs, pairs]
}

//  - - - - - - -
//1 2 3 4 5 6 7 8 9
//    - - - - -
export async function one(input: Pair[]): Promise<number> {
    let count = 0;

    input.forEach(pair => {
        const oneLength = (pair[0].to - pair[0].from) + 1;
        const twoLength = (pair[1].to - pair[1].from) + 1;

        const largest = oneLength >= twoLength ? pair[0] : pair[1];
        const smallest = largest === pair[0] ? pair[1] : pair[0];

        if (largest.from <= smallest.from && smallest.to <= largest.to) {
            count++;
        }
    })

    return count;
}

export async function two(input: Pair[]): Promise<number> {
    let count = 0;

    input.forEach(pair => {
        const oneLength = (pair[0].to - pair[0].from) + 1;
        const twoLength = (pair[1].to - pair[1].from) + 1;

        const one = new Set(new Array(oneLength).fill(null).map((_, i) => pair[0].from + i));
        const two = new Set(new Array(twoLength).fill(null).map((_, i) => pair[1].from + i));

        const largest = oneLength >= twoLength ? one : two;
        const smallest = largest === one ? two : one;

        let overlap = false;

        for (const section of smallest) {
            if (largest.has(section)) {
                overlap = true;
                break;
            }
        }

        if (overlap) {
            count++;
        }
    });

    return count;
}