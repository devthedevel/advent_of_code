import * as fs from 'fs';
import * as readline from 'readline';

async function getFileInput(file) {
    const stream = fs.createReadStream(file);

    const rl = readline.createInterface({
        input: stream
    });

    const data = [];
    for await (const line of rl) {
        data.push(line);
    }

    return data;
}

function formatKey(key) {
    const arr = key.split(' ')
    return `${arr[0]}-${arr[1]}`
}

function parseRules(data) {
    const rules = { }

    data.forEach(line => {
        const ruleArr = line.split('contain')

        const key = formatKey(ruleArr[0].trim())

        const content = { };
        if (ruleArr[1] !== ' no other bags.') {
            const contentsArr = ruleArr[1].split(',')
            contentsArr.forEach(ckey => {
                const str = ckey.trim();
                const idx = str.indexOf(' ')
                const num = parseInt(str.substring(0, idx))
                const _key = formatKey(str.substring(idx).trim())

                content[_key] = num;
            })
        }

        rules[key] = content;
    })

    return rules
}

function processRules(rules, validKeys, path, ruleKey, targetKey) {
    if (validKeys.has(ruleKey) || ruleKey === targetKey) {
        path.forEach(element => validKeys.add(element))
        return 
    }

    let rule
    if (!ruleKey) {
        rule = rules
    } else {
        rule = rules[ruleKey]
    }

    Object.keys(rule).forEach(key => {
        processRules(rules, validKeys, [...path, key], key, targetKey)
    })
}

function processRules2(rules, ruleKey, targetKey) {
    const rule = rules[ruleKey || targetKey]
    
    let sum = 1;
    Object.keys(rule).forEach(key => {
        const num = rule[key]
        sum += num * processRules2(rules, key, targetKey)
    })

    return sum
}

function calculateAnswer(data, targetKey) {
    const rules = parseRules(data)
    const set = new Set();

    processRules(rules, set, [ ], null, targetKey)

    set.delete(targetKey)
    return set.size;
}

function calculateAnswer2(data, targetKey) {
    const rules = parseRules(data)

    const sum = processRules2(rules, null, targetKey)


    return sum;
}

async function part1() {
    const data = await getFileInput('input.txt');

    const answer = calculateAnswer(data, 'shiny-gold');

    console.log(answer);
}

async function part2() {
    const data = await getFileInput('input.txt');

    const answer = calculateAnswer2(data, 'shiny-gold');

    console.log(answer);
}

async function main() {
    // await part1();

    await part2();
}

main();