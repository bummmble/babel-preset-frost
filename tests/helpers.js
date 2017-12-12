import { transformFile } from 'babel-core';
import { readdirSync } from 'fs';

const fixturesDir = './tests/fixtures/';

export function check(fixture, options) {
    options.minified = false;
    options.compact = false;
    options.babelrc = false;
    return new Promise((resolve, reject) => {
        transformFile(`${fixturesDir}${fixture}`, options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.code);
            }
        });
    });
}

export const fixtures = readdirSync(fixturesDir);
