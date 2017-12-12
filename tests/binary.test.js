import test from 'ava';
import buildPreset from '../src/index';
import { fixtures, check } from './helpers';

const options = buildPreset(null, {
  target: 'binary',
  sourceMaps: false,
  env: 'production',
});

fixtures.forEach((filename, index) => {
  test(`Should work for ${filename}`, async (t) => {
    const code = await check(filename, options);
    t.snapshot(code);
  });
});
