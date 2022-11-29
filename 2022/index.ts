import { Command, colors } from 'https://deno.land/x/cliffy@v0.25.4/mod.ts';
import { EOL } from "https://deno.land/std@0.166.0/node/os.ts";

interface Options {
    exclude: 1 | 2;
    bench: boolean;
    sample: boolean;
}

interface Module {
    input: (lines: string[]) => Promise<[any, any]>;
    one: (input: any) => Promise<any>;
    two: (input: any) => Promise<any>;
}

const header = colors.bold.white;
const solution = colors.green;
const bench = colors.yellow;

await new Command()
    .name("aoc")
    .version('0.1.0')
    .description('Command line tool to run 2022 Advent of Code scripts')
    .arguments('<day:number>')
    .option('-e, --exclude <part:number>', 'Exclude running a part')
    .option('-b, --bench', 'Benchmark the script')
    .option('-s, --sample', 'Use sample input file')
    // @ts-ignore
    .action(main)
    .parse(Deno.args);

async function main(options: Options, day: number) {
    const parts = ['Part One', 'Part Two'].filter((_, i) => i + 1 !== options.exclude);
    const inputFile = options.sample ? 'sample.txt' : 'input.txt';

    console.log(`${header('Running Day:')} ${day} (${parts.join(' & ')})`);
    console.log(`${header('Input File:')} ${inputFile}`)

    try {
        const module: Module = await import(`./${day}/index.ts`);

        const inputLines = await readInputFile(`./${day}/${inputFile}`);
        const parsedInput = await module.input(inputLines);

        if (options.exclude !== 1) {
            await runPart(parts[0], module.one, parsedInput[0], options.bench)
        }

        if (options.exclude !== 1) {
            await runPart(parts[1], module.two, parsedInput[1], options.bench)
        }
    } catch (e) {
        console.error(e)
    }
}

async function runPart(title: string, fn: any, input: any, shouldBench?: boolean): Promise<void> {
    console.log(header(`\n -= ${title} =-`))

    if (shouldBench) {
        performance.mark('start');
    }

    const answer = await fn(input);
    console.log(`${header('Solution:')} ${solution(String(answer))}`)

    if (shouldBench) {
        performance.mark('end');
        const measure = performance.measure('bench', 'start', 'end');
        console.log(`${header('Bench:')} ${bench(String(measure.duration) + ' ms')}`);
        performance.clearMarks('start');
        performance.clearMarks('end');
    }
}

async function readInputFile(file: string): Promise<string[]> {
    const data = await Deno.readFile(file);
    return new TextDecoder('utf-8').decode(data).split(EOL);
}