/**
 * @see https://adventofcode.com/2021/day/8
 * 
 * 1. In the output values, how many times do digits 1, 4, 7, 8 appear?
 * 2. What do you get if you add up all of the output values?
 */

import { parseInput } from '../../index';
import { Node } from '../../node';
import { equal, add, intersection, symmeticDifference } from '../../set';

type Signal = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

// Pattern will be two to seven signals long
type Pattern = string;

/**
 * Ordered list of signals where the index corresponds to the Segment enum index
 * 
 * Example: permutation[0] maps to Segment.TOP, while permutation[6] maps to Segment.BOTTOM_LEFT
 */
type Permutation = Signal[];

interface Input {
    signalPatterns: Signal[];
    outputs: string[];
}

/**
 * Seven segment display positions, where the enum index represents the segment display line.
 * 
 * Segments are specifically ordered to deduce pattern permutations
 * 
 *  0000
 * 1    2
 * 1    2
 *  3333
 * 4    5
 * 4    5
 *  6666
 */
enum Segment {
    TOP,
    TOP_RIGHT,
    BOTTOM_RIGHT,
    TOP_LEFT,
    MIDDLE,
    BOTTOM,
    BOTTOM_LEFT
}

// Map of number digits that maps to a set of segments
const Digits = {
    ZERO: new Set([Segment.TOP, Segment.TOP_LEFT, Segment.TOP_RIGHT, Segment.BOTTOM_LEFT, Segment.BOTTOM_RIGHT, Segment.BOTTOM]),
    ONE: new Set([Segment.TOP_RIGHT, Segment.BOTTOM_RIGHT]),
    TWO: new Set([Segment.TOP, Segment.TOP_RIGHT, Segment.MIDDLE, Segment.BOTTOM_LEFT, Segment.BOTTOM]),
    THREE: new Set([Segment.TOP, Segment.TOP_RIGHT, Segment.MIDDLE, Segment.BOTTOM_RIGHT, Segment.BOTTOM]),
    FOUR: new Set([Segment.TOP_LEFT, Segment.TOP_RIGHT, Segment.MIDDLE, Segment.BOTTOM_RIGHT]),
    FIVE: new Set([Segment.TOP, Segment.TOP_LEFT, Segment.MIDDLE, Segment.BOTTOM_RIGHT, Segment.BOTTOM]),
    SIX: new Set([Segment.TOP, Segment.TOP_LEFT, Segment.MIDDLE, Segment.BOTTOM_LEFT, Segment.BOTTOM_RIGHT, Segment.BOTTOM]),
    SEVEN: new Set([Segment.TOP, Segment.TOP_RIGHT, Segment.BOTTOM_RIGHT]),
    EIGHT: new Set([Segment.TOP, Segment.TOP_LEFT, Segment.TOP_RIGHT, Segment.MIDDLE, Segment.BOTTOM_LEFT, Segment.BOTTOM_RIGHT, Segment.BOTTOM]),
    NINE: new Set([Segment.TOP, Segment.TOP_LEFT, Segment.TOP_RIGHT, Segment.MIDDLE, Segment.BOTTOM_RIGHT, Segment.BOTTOM])
}

async function part1(file: string) {
    const input = await parseInput(file, null, line => {
        const [signals, output] = line.split('|');

        return {
            signalPatterns: signals.split(' ').filter(value => value !== ''),
            outputs: output.split(' ').filter(value => value !== '')
        }
    }) as Input[];


    const digitCounts = Array(10).fill(0);

    for (let line of input) {
        for (let output of line.outputs) {
            const length = output.length;

            if (length === Digits.ONE.size) {
                digitCounts[1]++;
            } else if (length === Digits.FOUR.size) {
                digitCounts[4]++;
            } else if (length === Digits.SEVEN.size) {
                digitCounts[7]++;
            } else if (length === Digits.EIGHT.size) {
                digitCounts[8]++;
            }
        }
    }

    const count = digitCounts.reduce((prev, curr) => prev += curr, 0);
    console.log(count);
}

async function part2(file: string) {
    const input = await parseInput(file, null, line => {
        const [signals, outputs] = line.split('|');

        return {
            signalPatterns: signals.split(' ').filter(value => value !== '').sort((a, b) => a.length - b.length),
            outputs: outputs.split(' ').filter(value => value !== '')
        }
    }) as Input[];

    const outputs = [];

    for (let line of input) {
        const permutations = getPermutations(line.signalPatterns);

        const validPermutation = getValidPermutation(permutations, line.signalPatterns);

        if (!validPermutation) {
            console.log('Unable to determine valid permutation');
            continue;
        }

        let num = 0;
        for (let i = 0; i < line.outputs.length; i++) {
            const output = line.outputs[i];

            const digit = getDigit(validPermutation, output);
            const value = parseDigit(digit);

            num += value * Math.pow(10, line.outputs.length - i - 1);
        }

        console.log(`Output '${line.outputs}' = ${num}`)
        outputs.push(num);
    }

    const sum = outputs.reduce((prev, curr) => prev += curr, 0);

    console.log(`Sum of all outputs = ${sum}`);
}

function getPermutations(patterns: Pattern[]): Permutation[] {
    /**
     * Get digits required to deduce segments.
     * 
     * ONE and SEVEN can determine the TOP, TOP_LEFT, and BOTTOM_RIGHT segments.
     * ONE and FOUR can determine the TOP_LEFT and MIDDLE segments.
     * ONE, SEVEN, FOUR, and EIGHT can determine the BOTTOM_LEFT and BOTTOM segments.
     */
    const one = new Set(patterns[0].split(''));
    const seven = new Set(patterns[1].split(''));
    const four = new Set(patterns[2].split(''));
    const eight = new Set(patterns[9].split(''));

    /**
     * Track which pairs of signals possibly map to two segments.
     * 
     * Pairs at index:
     * 0 => Segments TOP_RIGHT or BOTTOM_RIGHT
     * 1 => Segments TOP_LEFT or MIDDLE
     * 2 => Segments BOTTOM_LEFT and BOTTOM
     * 
     * Example:
     * possibleSignals = [['a', 'b']] indicates that either 'a' or 'b' may fulfil the TOP_RIGHT or
     * BOTTOM_RIGHT segments
     */
    const possibleSignals = [];

    // Track which signals have already been used
    const totalSignals = new Set();

    // Determine the TOP signal
    // The TOP signal will always be the difference of the ONE and SEVEN digits
    const signalTop = symmeticDifference(one, seven);
    const root = new Node(signalTop.values().next().value);

    // Determine possible signals for TOP_RIGHT and BOTTOM_RIGHT
    // These signals will be the intersection of ONE and SEVEN
    possibleSignals.push([...intersection(one, seven)]);

    add(totalSignals, one);
    add(totalSignals, seven);

    // Determine possible signals for TOP_LEFT and MIDDLE
    // These segments will be the difference of ONE and FOUR
    possibleSignals.push([...symmeticDifference(one, four)]);

    add(totalSignals, four);

    // Determine possible signals for BOTTOM_LEFT and BOTTOM
    // These signals will be the intersection of EIGHT and all the signals seen so far
    possibleSignals.push([...symmeticDifference(eight, totalSignals)]);

    return buildTree(root, possibleSignals).walk();
}

function buildTree(parent: Node<Signal>, possibleSignals: Signal[][]): Node<Signal> {
    if (possibleSignals.length === 0) {
        return;
    }

    const pair = possibleSignals.shift();

    /**
     * Since either elements in the pair can satisfy a segment, we add one as a child to 
     * the parent and then add the other as a child to the other.
     * 
     * This builds the tree such that unknown signals create two branches; where the branches
     * are permutations of either other.
     */
    const a = parent.addChild(pair[0]);
    const aChild = a.addChild(pair[1]);
    buildTree(aChild, possibleSignals);

    const b = parent.addChild(pair[1]);
    const bChild = b.addChild(pair[0]);
    buildTree(bChild, possibleSignals);

    possibleSignals.unshift(pair);

    return parent;
}

function getValidPermutation(permutations: Permutation[], patterns: Pattern[]): Permutation | null {
    for (let perm of permutations) {
        const permutationSegments = { };

        // Map permutation to segment indices
        for (let i = 0; i < perm.length; i++) {
            permutationSegments[i] = perm[i];
        }

        let valid = true;

        /**
         * Check to see if each signal pattern maps to a digit. There should be one unique
         * pattern per digit.
         * 
         * If all signal patterns map to a corresponding digit, then this permutation is valid
         */
        for (let pattern of patterns) {
            const digit = getDigit(perm, pattern);

            if (!digit) {
                valid = false;
                break;
            }
        }

        if (!valid) {
            continue;
        }

        return perm;
    }

    return null;
}

function getDigit(permutation: Permutation, pattern: Pattern): string | null {
    const segments = new Set();
    const signals = new Set([...pattern.split('')]);

    // Map signals to segment indices
    for (let i = 0; i < Object.keys(permutation).length; i++) {
        if (signals.has(permutation[i])) {
            segments.add(i);
        }
    }

    // Compare the segments to a digit, return it if its a valid digit
    for (let digit of Object.keys(Digits)) {
        if (equal(Digits[digit], segments)) {
            return digit;
        }
    }

    return null;
}

function parseDigit(digit: string): number | null {
    switch (digit) {
        case 'ZERO': return 0;
        case 'ONE': return 1;
        case 'TWO': return 2;
        case 'THREE': return 3;
        case 'FOUR': return 4;
        case 'FIVE': return 5;
        case 'SIX': return 6;
        case 'SEVEN': return 7;
        case 'EIGHT': return 8;
        case 'NINE': return 9;
        default: return null;
    }
}

const file = 'input.txt';
part2(file);