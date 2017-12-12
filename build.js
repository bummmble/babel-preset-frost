/* eslint-disable import/no-extraneous-dependencies */
const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const builtinModules = require('builtin-modules');
const args = require('minimist')(process.argv.slice(2));
const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies).concat(builtinModules);

function getFormatAndName() {
  if (args.es) {
    return { format: 'es', name: 'index.es.js' };
  }
  return { format: 'cjs', name: 'index.cjs.js' };
}

function build() {
  const { format, name } = getFormatAndName();

  return rollup({
    entry: 'src/index.js',
    external,
    plugins: [babel()],
  })
    .then(({ write }) =>
      write({
        dest: `dist/${name}`,
        format,
      }))
    .then(() => console.log(`Babel-Preset-Frost built in ${format} format`))
    .catch(err => console.error(err));
}

build();
