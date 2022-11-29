import { readFile } from 'fs/promises';
import { StringDecoder } from 'string_decoder';
import { EOL } from 'os';

export async function parseInput<T>(file: string, deliminator?: string, mapFn?: (item: string) => T): Promise<T[] | string[]> {
    const buffer = await readFile(file);
    const decoder = new StringDecoder();

    const data = decoder.write(buffer).split(deliminator ?? EOL);

    return mapFn ? data.map(mapFn) as T[] : data as string[];
}