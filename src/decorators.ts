export function Advent(year: number, day: number, sample: boolean = false) {
    return function<T extends { new (...args: any[]): {} }>(constructor: T) {
        const path = `./src/${year}/${day}/${sample ? 'default' : 'input'}.txt`;
        console.log(`Starting AoC ${year}, day ${day}`);
        console.log(`Using input file: ${path}`)
        constructor.prototype.file = path;
    }
}

export function Timed(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value;

    descriptor.value = function (...args) {
        console.time(propertyKey);
        const result = fn.apply(this, args);
        console.timeEnd(propertyKey);

        return result;
    }
}