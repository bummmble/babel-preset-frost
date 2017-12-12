import test from 'ava';
import buildPreset from '../src/index';
import { fixtures, check } from './helpers';

const options = buildPreset(null, {
    modules: false,
    sourceMaps: false,
    compression: true,
    env: 'production'
});

fixtures.forEach((filename, index) => {
    test(`production for ${filename}`, async t => {
        const code = await check(filename, options);
        t.snapshot(code);
    });
});
