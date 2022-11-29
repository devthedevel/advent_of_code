import { Command, colors } from 'https://deno.land/x/cliffy@v0.25.4/mod.ts';

interface Options {
    exclude: 1 | 2;
    bench: boolean;
    sample: boolean;
}

interface Module {
    input: (file: string) => Promise<[any, any]>;
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

        const input = await module.input(inputFile);

        if (options.exclude !== 1) {
            console.log(header('\n== Part One =='))
            console.group();

            if (options.bench) {
                performance.mark('oneStart');
            }

            const answer = await module.one(input[0]);
            console.groupEnd();
            console.log(`${header('Solution:')} ${solution(String(answer))}`)

            if (options.bench) {
                performance.mark('oneEnd');
                const measure = performance.measure('one', 'oneStart', 'oneEnd');
                console.log(`${header('Bench:')} ${bench(String(measure.duration) + ' ms')}`)
            }
        }

        if (options.exclude !== 2) {
            console.log(header('\n== Part Two =='))
            console.group();

            if (options.bench) {
                performance.mark('twoStart');
            }

            const answer = await module.two(input[1]);
            console.groupEnd();
            console.log(`${header('Solution:')} ${solution(String(answer))}`)

            if (options.bench) {
                performance.mark('twoEnd');
                const measure = performance.measure('two', 'twoStart', 'twoEnd');
                console.log(`${header('Bench:')} ${bench(String(measure.duration) + ' ms')}`)
            }
        }
    } catch (e) {
        console.error(e)
    }
}