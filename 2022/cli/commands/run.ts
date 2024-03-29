import { header, solution, bench } from '../colors.ts';
import { join, resolve, toFileUrl } from '../../deps/path.ts';
import { EOL } from 'https://deno.land/std@0.166.0/node/os.ts';

interface RunCommandOptions {
    exclude: 1 | 2;
    bench: boolean;
    sample: boolean;
}

interface Module {
    input: (lines: string[]) => [any, any];
    one: AocFunction;
    two: AocFunction;
}

type AocFunction = (input: any) => any;

export async function run(options: RunCommandOptions, day: number) {
    const parts = ['Part One', 'Part Two'].filter((_, i) => i + 1 !== options.exclude);
    const inputFile = options.sample ? 'sample.txt' : 'input.txt';

    const root = join(Deno.cwd(), String(day));
    const dynModulePath = toFileUrl(resolve(root, 'index.ts')).toString();
    const inputPath = resolve(root, inputFile);

    console.log(`${header('Running Day:')} ${day} (${parts.join(' & ')})`);
    console.log(`${header('Input File:')} ${inputPath}`)

    try {
        const module: Module = await import(dynModulePath);

        if (options.bench) {
            performance.mark('input');
        }

        const inputLines = await readInputFile(inputPath);
        const parsedInput = module.input(inputLines);

        if (options.bench) {
            performance.mark('inputEnd');
            const measure = performance.measure('inputBench', 'input', 'inputEnd');
            console.log(`${header('Input Bench: ')} ${bench(String(measure.duration) + ' ms')}`);
        }

        if (options.exclude !== 1) {
            runPart(parts[0], module.one, parsedInput[0], options.bench)
        }

        if (options.exclude !== 1) {
            runPart(parts[1], module.two, parsedInput[1], options.bench)
        }
    } catch (e) {
        if (e.code === 'ERR_MODULE_NOT_FOUND') {
            console.error(`Unable to open module ${dynModulePath}`)
        } else if (e instanceof Deno.errors.NotFound) {
            console.error(`Unable to open input file ${inputPath}`)
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