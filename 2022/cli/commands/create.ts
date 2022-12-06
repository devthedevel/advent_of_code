import { join, resolve } from '../../deps/path.ts';
import { Input } from '../../deps/cliffy.ts';
import { header } from '../colors.ts';

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

    const root = join(Deno.cwd(), String(_day));
    const dynModulePath = resolve(root, 'index.ts');
    const inputPath = resolve(root, 'input.txt');
    const sampleInputPath = resolve(root, 'sample.txt');
    const defaultModulePath = import.meta.resolve('../default-module.ts').replace('file:///', '');

    if (!await exists(root)) {
        await Deno.mkdir(root);
    }

    await Promise.allSettled([
        createModuleFile(defaultModulePath, dynModulePath),
        createInputFile(inputPath),
        createInputFile(sampleInputPath)
    ]);

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

async function createModuleFile(defaultModPath: string, path: string) {
    if (!await exists(path)) {
        await Deno.copyFile(defaultModPath, path);
    }
}

async function createInputFile(path: string) {
    if (!await exists(path)) {
        await Deno.writeFile(path, new TextEncoder().encode(''));
    }
}