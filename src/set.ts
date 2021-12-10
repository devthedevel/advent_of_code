export function equal<T>(a: Set<T>, b: Set<T>): boolean {
    if (a.size !== b.size) return false;

    for (let i of a) {
        if (!b.has(i)) {
            return false;
        }
    }

    return true;
}

export function add<T>(a: Set<T>, b: Set<T> | T[]): number {
    if (Array.isArray(b)) {
        for (let value of b) {
            a.add(value);
        }
    } else {
        for (let value of b.values()) {
            a.add(value);
        }
    }

    return a.size;
}

export function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
    const interesection: Set<T> = new Set();

    for (let i of b) {
        if (a.has(i)) {
            interesection.add(i);
        }
    }

    return interesection;
}

export function symmeticDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
    const diff = new Set(a);

    for (let i of b) {
        if (diff.has(i)) {
            diff.delete(i);
        } else {
            diff.add(i);
        }
    }

    return diff;
}