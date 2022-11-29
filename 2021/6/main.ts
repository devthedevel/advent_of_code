import { parseInput } from '../../index';

async function part1(file) {
    console.time('exeTime');

    const NUM_DAYS = 256;
    const WEEK = 7;

    // Objects to track fish. Both contain 7 keys, from 0 to 6, representing a week
    const totalFish = { };
    const fishToAdd = { };

    // Initialize objects to 0
    for (let i = 0; i < WEEK; i++) {
        totalFish[i] = 0;
        fishToAdd[i] = 0;
    }

    const input = await parseInput(file, ',', num => parseInt(num)) as number[];

    /**
     * Populate totalFish from input.
     * This tracks how many fish are X days away from reproducing.
     */
    for (let day of input) {
        totalFish[day]++;
    }

    /**
     * Simulate fish.
     * 
     * One full week is equal to one full iteration of the objects.
     * Fish take one week to reproduce.
     * New fish are added 8 days from the current day.
     * If there are any fish to add for the day, they are added. It will be another week 
     * before they reproduce.
     */
    for (let day = 0; day < NUM_DAYS; day++) {
        const currDayIdx = day % WEEK;

        fishToAdd[(day + 2) % WEEK] = totalFish[currDayIdx];

        totalFish[currDayIdx] += fishToAdd[currDayIdx];
        fishToAdd[currDayIdx] = 0;
    }

    /**
     *  Sum up total fish. 
     *  There should ONLY be 2 non-zero values in fishToAdd. 
     *  These are the fish that are 7 and 8 days away respective to the end of simulation
     */
    let sum = 0;
    Object.keys(totalFish).forEach(key => sum += totalFish[key]);
    Object.keys(fishToAdd).forEach(key => sum += fishToAdd[key]);

    console.log(`Total number of fish after ${NUM_DAYS} days: ${sum}`);
    console.timeEnd('exeTime');
}

const file = 'input.txt';
part1(file).catch(err => console.error(err));