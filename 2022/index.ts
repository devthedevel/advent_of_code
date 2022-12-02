import { Command } from 'https://deno.land/x/cliffy@v0.25.4/mod.ts';
import { run } from './run.ts';

await new Command()
    .name("aoc")
    .version('0.1.0')
    .description('Command line tool to run 2022 Advent of Code scripts')
    .arguments('<day:number>')
    .option('-e, --exclude <part:number>', 'Exclude running a part')
    .option('-b, --bench', 'Benchmark the script')
    .option('-s, --sample', 'Use sample input file')
    // @ts-ignore
    .action(run)
    .parse(Deno.args);