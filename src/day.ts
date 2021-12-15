import { readFile } from 'fs';
import { StringDecoder } from 'string_decoder';
import { EOL } from 'os';

export abstract class Day<T> {
    constructor() {
        // @ts-ignore
        readFile(this.file, (err, data) => {
            if (err) {
                console.error(err);
            }

            const decoder = new StringDecoder();
            const input = this.transform(decoder.write(data).split(EOL)) as T;

            this.one(input);
            this.two(input);
        });

    }

    abstract transform(data: string[]): T;

    abstract one(input: T);

    abstract two(input: T);
}