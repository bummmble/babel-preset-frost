import test from 'ava';
import buildPreset from '../src/index';
import { fixtures, check } from './helpers';

const options = buildPreset(null, {
    modules: false,
    target: { browsers: 'ie 11', node: '8.0.0' },
    imports: 'webpack',
    sourceMaps: false
});

fixtures.forEach((filename, index) => {
    test(`webpack for ${filename}`, async t => {
        const code = await check(filename, options);
        t.snapshot(code);
    });
});
