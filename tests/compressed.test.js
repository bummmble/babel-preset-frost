import test from 'ava';
import { fixtures, check } from './helpers';
import buildPreset from '../src/index';

const options = buildPreset(null, {
  modules: false,
  sourceMaps: false,
  compression: true,
});

fixtures.forEach((filename, index) => {
  test(`Compression test for ${filename}`, async (t) => {
    const code = await check(filename, options);
    t.snapshot(code);
  });
});
