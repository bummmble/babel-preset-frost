import test from 'ava';
import buildPreset from '../src/index';
import { fixtures, check } from './helpers';

const options = buildPreset(null, {
  modules: false,
  target: 'es2015',
  sourceMaps: false,
});

fixtures.forEach((filename, index) => {
  test(`es2015 for ${filename}`, async (t) => {
    const code = await check(filename, options);
    t.snapshot(code);
  });
});
