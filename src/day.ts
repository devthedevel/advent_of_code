import { readFile } from 'fs';
import { StringDecoder } from 'string_decoder';
import { EOL } from 'os';

export type Input<T> = T[];

export abstract class Day<T> {
    constructor() {
        // @ts-ignore
        readFile(this.file, (err, data) => {
            if (err) {
                console.error(err);
            }

            const decoder = new StringDecoder();
            const input = this.transform(decoder.write(data).split(EOL)) as Input<T>;

            this.one(input);
            this.two(input);
        });

    }

    abstract transform(data: string[]): Input<T>;

    abstract one(input: Input<T>);

    abstract two(input: Input<T>);
}