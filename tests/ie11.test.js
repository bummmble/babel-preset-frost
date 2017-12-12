import test from 'ava';
import buildPreset from '../src/index';
import { fixtures, check } from './helpers';

const options = buildPreset(null, {
    modules: false,
    target: { browsers: 'ie 11' },
    sourceMaps: false
});

fixtures.forEach((filename, index) => {
    test(`ie11 for ${filename}`, async t => {
        const code = await check(filename, options);
        t.snapshot(code);
    });
});
