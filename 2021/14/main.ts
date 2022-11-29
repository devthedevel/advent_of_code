import { Advent, Timed } from '../../decorators';
import { Day } from '../../day';

interface Input {
    template: string;
    rules: Map<string, string>;
}

@Advent(2021, 14, false)
class Day14 extends Day<Input> {

    @Timed
    transform(data: string[]): Input {
        const input = {
            template: data[0],
            rules: new Map()
        };

        for (let i = 2; i < data.length; i++) {
            const [pattern, character] = data[i].split('->');

            input.rules.set(pattern.trim(), character.trim());
        }

        return input;
    }

    @Timed
    one(input: Input) {
        const numSteps = 10;
        let template = input.template;

        for (let i = 0; i < numSteps; i++) {
            const stack = [];

            // Iterate through every pair in template
            for (let j = 0; j < template.length; j++) {
                const pair = template.substring(j, j + 2);

                stack.push(pair.charAt(0));

                if (!input.rules.has(pair)) {
                    continue;
                }

                stack.push(input.rules.get(pair));
            }

            template = stack.join('')
        }

        const characterMap = { }

        // Count the total number of each chaaracter
        for (let i = 0; i < template.length; i++) {
            const character = template.charAt(i);
            if (!characterMap[character]) {
                characterMap[character] = 0;
            }

            characterMap[character]++;
        }

        const sorted = Object.values(characterMap).sort((a: number, b: number) => a - b) as number[];

        const min = sorted[0];
        const max = sorted[sorted.length - 1];

        console.log(`${max - min}`);
    }

    @Timed
    two(input: Input) {
        const numSteps = 40;
        let pairs = { };

        // Populate pairs
        for (let i = 0; i < input.template.length - 1; i++) {
            const pair = input.template.substring(i, i + 2);

            if (!pairs[pair]) {
                pairs[pair] = 0;
            }

            pairs[pair]++;
        }

        for (let i = 0; i < numSteps; i++) {
            const length = Object.keys(pairs).length;

            const toAdd = { };

            for (let j = 0; j < length; j++) {
                const key = Object.keys(pairs)[j];
                const pairCount = pairs[key];

                const character = input.rules.get(key);

                const pair1 = key.charAt(0) + character;
                const pair2 = character + key.charAt(1);

                if (!toAdd[pair1]) {
                    toAdd[pair1] = 0;
                }

                if (!toAdd[pair2]) {
                    toAdd[pair2] = 0;
                }

                // Add new pairs created from the character insertion
                toAdd[pair1] += pairCount;
                toAdd[pair2] += pairCount;

                // Delete the old pair
                pairs[key] = 0;
            }

            pairs = {...pairs, ...toAdd};
        }

        const characterMap = { }

        for (let key of Object.keys(pairs)) {
            const count = pairs[key];

            const [first, last] = key;

            if (!characterMap[first]) {
                characterMap[first] = 0;
            }

            if (!characterMap[last]) {
                characterMap[last] = 0;
            }

            characterMap[last] += count;
            characterMap[first] += count;
        }

        const sorted = Object.values(characterMap).sort((a: number, b: number) => a - b) as number[];

        const min = Math.ceil(sorted[0] / 2);
        const max = Math.ceil(sorted[sorted.length - 1] / 2);

        console.log(`${max - min}`);
    }
}

new Day14();