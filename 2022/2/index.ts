type FriendlyRps = 'X' | 'Y' | 'Z';
type FoeRps = 'A' | 'B' | 'C';

enum Rps {
    Rock,
    Paper,
    Scissors
}

interface RpsMatch {
    friendly: Rps;
    foe: Rps;
}

export function input(lines: string[]): [RpsMatch[], any] {
    const foeMapping = {
        A: Rps.Rock,
        B: Rps.Paper,
        C: Rps.Scissors
    }

    const friendlyMapping = {
        X: Rps.Rock,
        Y: Rps.Paper,
        Z: Rps.Scissors
    }

    const matches = lines.map(line => {
        const arr = line.split(' ');

        return {
            foe: foeMapping[arr[0] as FoeRps],
            friendly: friendlyMapping[arr[1] as FriendlyRps]
        }
    })

    return [matches, matches];
}

export function one(input: RpsMatch[]): number {
    const scores = {
        Rock: 1,
        Paper: 2,
        Scissors: 3
    }

    const processRpsMatch = (match: RpsMatch): number => {
        // @ts-ignore
        let score: number = scores[Rps[match.friendly]];

        if (match.friendly === match.foe) {
            score += 3;
        } else if ((match.friendly + 1) % 3 === match.foe) {
            score += 0;
        } else if ((match.friendly + 2) % 3 === match.foe) {
            score +=6
        }

        return score;
    }

    return input.reduce((acc, curr) => acc + processRpsMatch(curr), 0);
}

export function two(input: RpsMatch[]): number {
    const scores = {
        Rock: 1,
        Paper: 2,
        Scissors: 3
    }

    // Rock = lost, Paper = draw, Scissors = win
    const fixMatch = (match: RpsMatch): RpsMatch => {
        const _match = { ...match };

        if (match.friendly === Rps.Rock) {
            _match.friendly = (match.foe + 2) % 3;
        } else if (match.friendly === Rps.Paper) {
            _match.friendly = _match.foe;
        } else if (match.friendly === Rps.Scissors) {
            _match.friendly = (match.foe + 1) % 3;
        }

        return _match;
    }

    const processRpsMatch = (match: RpsMatch): number => {
        // @ts-ignore
        let score: number = scores[Rps[match.friendly]];

        if (match.friendly === match.foe) {
            score += 3;
        } else if ((match.friendly + 1) % 3 === match.foe) {
            score += 0;
        } else if ((match.friendly + 2) % 3 === match.foe) {
            score +=6
        }

        return score;
    }

    return input
        .map(match => fixMatch(match))
        .reduce((acc, curr) => acc + processRpsMatch(curr), 0);
}