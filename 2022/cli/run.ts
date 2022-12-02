import { header, solution, bench } from './colors.ts';
import { EOL } from 'https://deno.land/std@0.166.0/node/os.ts';

interface RunCommandOptions {
    exclude: 1 | 2;
    bench: boolean;
    sample: boolean;
}

interface Module {
    input: (lines: string[]) => Promise<[any, any]>;
    one: AocFunction;
    two: AocFunction;
}

type AocFunction = (input: any) => Promise<any>;

export async function run(options: RunCommandOptions, day: number) {
    const parts = ['Part One', 'Part Two'].filter((_, i) => i + 1 !== options.exclude);
    const inputFile = options.sample ? 'sample.txt' : 'input.txt';

    const modulePath = `./${day}/index.ts`;
    const inputPath = `./${day}/${inputFile}`;

    console.log(`${header('Running Day:')} ${day} (${parts.join(' & ')})`);
    console.log(`${header('Input File:')} ${inputFile}`)

    try {
        const module: Module = await import(modulePath);

        const inputLines = await readInputFile(inputPath);
        const parsedInput = await module.input(inputLines);

        if (options.exclude !== 1) {
            await runPart(parts[0], module.one, parsedInput[0], options.bench)
        }

        if (options.exclude !== 1) {
            await runPart(parts[1], module.two, parsedInput[1], options.bench)
        }
    } catch (e) {
        if (e.code === 'ERR_MODULE_NOT_FOUND') {
            console.error(`Unable to open module ${modulePath}`)
        } else if (e instanceof Deno.errors.NotFound) {
            console.error(`Unable to open input file ${inputFile}`)
        }
        Deno.exit(1);
    }

    Deno.exit();
}

async function runPart(title: string, fn: AocFunction, input: any, shouldBench?: boolean): Promise<void> {
    console.log(header(`\n -= ${title} =-`))

    try {
        if (!fn) {
            console.error('Cannot find function');
            return
        }
    
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
    } catch (error) {
        console.error(error)
    }
}

async function readInputFile(file: string): Promise<string[]> {
    const data = await Deno.readFile(file);
    return new TextDecoder('utf-8').decode(data).split(EOL);
}