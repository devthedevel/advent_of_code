enum Direction {
    Up = 'U',
    Right = 'R',
    Down = 'D',
    Left = 'L'
}

interface Step {
    direction: Direction;
    number: number;
}

interface Coord {
    x: number;
    y: number;
}

export function input(lines: string[]): [Step[], any] {
    const steps = lines.map(line => {
        const args = line.split(' ');
        return {
            direction: args[0] as Direction,
            number: Number(args[1])
        }
    })

    return [steps, steps];
}

export function one(input: Step[]): number {
    return solve(input, 2)
}

export function two(input: Step[]): number {
    return solve(input, 10)
}

function solve(steps: Step[], ropeLength: number): number {
    const rope: Coord[] = new Array(ropeLength).fill(null).map(() => {
        return {
            x: 0,
            y: 0
        }
    })

    const visited: Coord[] = [];

    steps.forEach(step => processRopePhysics(rope, step, visited));
    
    return visited.length;
}

function processRopePhysics(rope: Coord[], step: Step, visited: Coord[]) {
    for (let i = 0; i < step.number; i++) {
        if (step.direction === Direction.Up) {
            rope[0].y++;
        } else if (step.direction === Direction.Right) {
            rope[0].x++;
        } else if (step.direction === Direction.Down) {
            rope[0].y--;
        } else if (step.direction === Direction.Left) {
            rope[0].x--;
        }

        for (let j = 1; j < rope.length; j++) {
            const head = rope[j-1];
            const tail = rope[j];

            const diff: Coord = {
                x: head.x - tail.x,
                y: head.y - tail.y
            }
    
            if (diff.y >= 2) {
                tail.y++;
    
                if (diff.x >= 1) {
                    tail.x++;
                } else if (diff.x <= -1) {
                    tail.x--;
                }
            } else if (diff.y <= -2) {
                tail.y--;
    
                if (diff.x >= 1) {
                    tail.x++;
                } else if (diff.x <= -1) {
                    tail.x--;
                }
            } else if (diff.x >= 2) {
                tail.x++;
    
                if (diff.y >= 1) {
                    tail.y++;
                } else if (diff.y <= -1) {
                    tail.y--;
                }
            } else if (diff.x <= -2) {
                tail.x--;
    
                if (diff.y >= 1) {
                    tail.y++;
                } else if (diff.y <= -1) {
                    tail.y--;
                }
            }
        }

        addVisited(visited, rope[rope.length - 1]);
    }
}

function addVisited(visited: Coord[], coord: Coord) {
    if (!visited.find(item => item.x === coord.x && item.y === coord.y)) {
        visited.push({...coord});
    }
}