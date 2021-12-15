import { Advent, Timed } from '../../decorators';
import { Day } from '../../day';

interface Position {
    x: number;
    y: number;
}

enum Direction {
    VERTICAL,
    HORIZONTAL
}

interface Fold {
    direction: Direction;
    line: number;
}

interface Input {
    dots: Position[];
    folds: Fold[];
}

@Advent(2021, 13, false)
class Day13 extends Day<Input> {

    @Timed
    //@ts-ignore
    transform(data: string[]) {
        const input: Input = {
            dots: [],
            folds: []
        };

        for (let line of data) {
            if (line === '') {
                continue;
            }

            if (line.includes('fold along')) {
                const [dir, num] = line.replace('fold along', '').trim().split('=');

                input.folds.push({
                    direction: dir === 'x' ? Direction.VERTICAL : Direction.HORIZONTAL,
                    line: parseInt(num)
                });

                continue;
            }

            const [x, y] = line.split(',');

            input.dots.push({
                x: parseInt(x),
                y: parseInt(y)
            });
        }

        return input;
    }

    @Timed
    //@ts-ignore
    one(input: Input) {
        const dots = new Map<string, Position>();

        // Populate
        for (let dot of input.dots) {
            dots.set(this.getKey(dot), dot);
        }

        for (let i = 0; i < input.folds.length; i++) {
            const fold = input.folds[i];
 
            if (fold.direction === Direction.HORIZONTAL) {
                for (let dot of dots.values()) {
                    if (dot.y > fold.line) {
                        const diff = dot.y - fold.line;
        
                        const pos = {
                            x: dot.x,
                            y: fold.line - diff
                        };
        
                        const key = this.getKey(pos as Position);
        
                        dots.set(key, pos);
                        dots.delete(this.getKey(dot))
                    }
                }
            } else {
                for (let dot of dots.values()) {
                    if (dot.x > fold.line) {
                        const diff = dot.x - fold.line;
        
                        const pos = {
                            x: fold.line - diff,
                            y: dot.y
                        };
        
                        const key = this.getKey(pos as Position);
        
                        dots.set(key, pos);
                        dots.delete(this.getKey(dot))
                    }
                }
            }

            if (i === 0) {
                console.log(`There are ${dots.size} dots after the first fold`);
            }
        }


        const display = [];

        // Add all dots into a display array
        for (let dot of dots.values()) {
            if (!display[dot.y]) {
                display[dot.y] = [];
            }

            display[dot.y][dot.x] = '#';
        }

        // Populate empty spaces in display array
        for (let row of display) {
            for (let col = 0; col < row.length; col++) {
                if (!row[col]) {
                    row[col] = ' ';
                }
            }
        }

        // Log the display array
        for (let row of display) {
            console.log(row.join(''));
        }
    }

    two(input) { }

    getKey(dot: Position): string {
        return `${dot.x}|${dot.y}`;
    }
}

new Day13();