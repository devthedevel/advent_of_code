export async function input(lines: string[]): Promise<any> {
    return [lines, lines]
}

export async function one(input: string[]) {
    console.log(`input for part 1: ${input}`)
    throw new Error('failed')


}

export async function two(input: string[]) {
    console.log(`input for part 2: ${input}`)
    return 'test'
}