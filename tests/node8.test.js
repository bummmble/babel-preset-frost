import test from 'ava';
import buildPreset from '../src/index';
import { fixtures, check } from './helpers';

const options = buildPreset(null, {
    modules: false,
    target: 'node8',
    imports: 'rollup-nodejs',
    sourceMaps: false
});

fixtures.forEach((filename, index) => {
    test(`node8 for ${filename}`, async t => {
        const code = await check(filename, options);
        t.snapshot(code);
    });
});
