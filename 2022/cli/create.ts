import { Input } from '../deps/cliffy.ts';
import { header } from './colors.ts';

// deno-lint-ignore no-empty-interface
interface CreateCommandOptions { }

export async function create(_options: CreateCommandOptions, day: number) {
    const defaultDay = new Date().getDate();
    const _day = day ?? await Input.prompt({
        message: 'What day to create?',
        default: String(defaultDay)
    });

    if (_day < 1 || _day > 25) {
        console.log(`Invalid day: ${_day}`);
        return;
    }

    const folderPath = `./${_day}`;
    const modulePath = `${folderPath}/index.ts`;
    const inputPath = `${folderPath}/input.txt`
    const sampleInputPath = `${folderPath}/sample.txt`

    if (!await exists(folderPath)) {
        await Deno.mkdir(folderPath);
    }

    if (!await exists(modulePath)) {
        await Deno.copyFile('./default-module.ts', modulePath);
    }

    if (!await exists(inputPath)) {
        await Deno.writeFile(inputPath, new TextEncoder().encode(''));
    }

    if (!await exists(sampleInputPath)) {
        await Deno.writeFile(sampleInputPath, new TextEncoder().encode(''));
    }

    console.log(header(`Created day ${_day}! To run day ${_day}, run the following command:\n`));
    console.log(`deno task run ${_day}\n`);
}

async function exists(modulePath: string): Promise<boolean> {
    try {
        await Deno.stat(modulePath);
        return true;
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            return false;
        }
        
        throw new Error(`Unable to read module ${modulePath}`);
    }
}