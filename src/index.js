import browserslist from 'browserslist';
import envPreset, { isPluginRequired } from 'babel-preset-env';
import getTargets from 'babel-preset-env/lib/targets-parser';
import envPlugins from 'babel-preset-env/data/plugins.json';

import minifyPreset from 'babel-preset-minify';
import deadCodeEliminationPlugin from 'babel-plugin-minify-dead-code-elimination';
import dynamicImportSyntaxPlugin from 'babel-plugin-syntax-dynamic-import';
import dynamicImportRollupNode from 'babel-plugin-dynamic-import-node';
import dynamicImportRollupPlugin from 'babel-plugin-dynamic-import-webpack';
import dynamicImportUniversalWebpack from 'babel-plugin-universal-import';

import fastAsyncPlugin from 'babel-plugin-fast-async';
import classPropertiesPlugin from 'babel-plugin-transform-class-properties';
import objectRestSpreadPlugin from 'babel-plugin-transform-object-rest-spread';
import lodashPlugin from 'babel-plugin-lodash';
import transformRuntimePlugin from 'babel-plugin-transform-runtime';

import parseJSX from 'babel-plugin-syntax-jsx';
import transformReactJSX from 'babel-plugin-transform-react-jsx';
import transformReactJSXSource from 'babel-plugin-transform-react-jsx-source';
import transformReactJSXSelf from 'babel-plugin-transform-react-jsx-self';
import transformRemovePropTypes from 'babel-plugin-transform-react-remove-prop-types';
import reactIntlPlugin from 'babel-plugin-react-intl';
import reactInlineElementsPlugin from 'babel-plugin-transform-react-inline-elements';
import reactConstantElements from 'babel-plugin-transform-react-constant-elements';

import { modernTarget } from './modernTarget';

/* eslint-disable eqeqeq */
const defaults = {
  debug: false,
  target: 'nodejs',
  env: 'auto',
  modules: 'auto',
  imports: 'auto',
  useBuiltIns: true,
  jsxPragma: 'React.createElement',
  rewriteAsync: 'promises',
  looseMode: true,
  specMode: false,
  optimizeModules: ['lodash', 'async', 'ramda', 'recompose'],
  sourceMaps: true,
  compression: false,
  comments: false,
  minified: false,
  framework: 'react',
};

/* eslint-disable no-param-reassign */
export default function buildPreset(ctx, options = {}) {
  const presets = [];
  const plugins = [];
  const config = { ...defaults, ...options };

  // reset env if it is set to auto
  if (config.env === 'auto') {
    config.env = null;
  }

  const envValue =
        config.env ||
        process.env.BABEL_ENV ||
        process.env.NODE_ENV ||
        'development';
  const isProd = /\bproduction\b/.test(envValue);

  if (config.debug) {
    console.log('frost-babel-preset: Environment', envValue);
    console.log('frost-babel-preset: is Production?', isProd);
  }

  // Auto select test
  /* eslint-disable no-unused-expressions */
  if (envValue === 'test' && options.target == null) {
    config.target === 'test';
  }

  const buildBinary =
        config.target === 'node' ||
        config.target === 'node8' ||
        config.target === 'nodejs' ||
        config.target === 'script' ||
        config.target === 'binary';
  const buildBrowserList =
        config.target === 'browser' || config.target === 'web';
  const buildCurrent =
        config.target === 'current' || config.target === 'test';
  const buildLibrary =
        config.target === 'library' ||
        config.target === 'es2015' ||
        config.target === 'modern';
  const buildCustom = typeof config.target === 'object';
  let envTargets = {};

  if (buildBinary) {
    // Last stable NodeJS (LTS) - first LTS of 6.x.x was 6.9.0
    // https://nodejs.org/en/blog/release/v6.9.0
    // Expected LTS for v8.0.0 is October 2017, https://github.com/nodejs/LTS
    // This is allowed already when setting target to 'node8'
    envTargets.node = config.target === 'node8' ? '8.0.0' : '6.9.0';
  } else if (buildCurrent) {
    // Scripts that are directly used can be transpiled for current node
    envTargets.node = 'current';
  } else if (buildBrowserList) {
    const autoBrowsers = browserslist(null, {
      env: isProd ? 'production' : 'development',
    });
    envTargets.browsers = autoBrowsers;
  } else if (buildLibrary) {
    if (config.target === 'modern') {
      envTargets = modernTarget;
    } else {
      envTargets = undefined;
    }
  } else if (buildCustom) {
    envTargets = config.target;
  }

  const additionalExcludes = [];

  // Excludes all es2015 features which are supported by the default es2015 babel preset
  // This targets all 2015 capable browsers and engines
  if (config.target === 'es2015') {
    additionalExcludes.push(
      'check-es2015-constants',
      'transform-es2015-template-literals',
      'transform-es2015-function-name',
      'transform-es2015-block-scoped-functions',
      'transform-es2015-classes',
      'transform-es2015-object-super',
      'transform-es2015-shorthand-properties',
    );
  }

  if (config.debug) {
    if (config.target === 'es2015') {
      console.log('frost-babel-preset: Environment type -- es2015');
    } else {
      console.log(`frost-babel-preset: Environment targets: ${envTargets}`);
    }
  }

  // Auto detect modules based on target
  if (config.modules == null || config.modules === 'auto') {
    if (buildCurrent || buildBinary) {
      config.modules = 'commonjs';
    } else if (buildLibrary || buildBrowserList) {
      // Libraries should be published as ESModules for tree shaking
      // browsers usually will use something like webpack which itself benefits
      // from ESModules
      config.modules = false;
    } else {
      config.modules = 'commonjs';
    }
  }

  // Autodetect of imports based on target
  if (config.imports == null || config.imports == 'auto') {
    if (buildCurrent || buildBinary) {
      config.imports = 'rollup-nodejs';
    } else if (buildLibrary || buildCustom) {
      config.imports = 'rollup-webpack';
    } else if (buildBrowserList) {
      config.imports = 'webpack';
    } else {
      config.imports = null;
    }
  }

  // Automatic chunkNames require webpack comments
  if (config.imports === 'webpack') {
    config.comments = true;
  }

  // Ask babel whether we should transform async based on current
  // Targets, otherwise we assume it works without transpilation
  const requiresAsync = isPluginRequired(
    getTargets(envTargets),
    envPlugins['transform-async-to-generator'],
  );
  if (!requiresAsync) {
    config.rewriteAsync = null;
  }

  // Use basic compression for libraries and full on binaries
  if (config.compression) {
    if (isProd && buildBinary) {
      presets.push(minifyPreset);
    } else {
      presets.push([
        minifyPreset,
        {
          booleans: false,
          infinity: false,
          mangle: false,
          flipComparisons: false,
          simplify: false,
          keepFnName: true,
        },
      ]);
    }
  } else {
    plugins.push(deadCodeEliminationPlugin);
  }

  presets.push([
    envPreset,
    {
      modules: config.modules,
      useBuiltIns: config.useBuiltIns,
      loose: config.loose,
      spec: config.spec,
      exclude: [
        'transform-regenerator',
        'transform-async-to-generator',
        ...additionalExcludes,
      ],
      targets: envTargets,
    },
  ]);

  plugins.push(dynamicImportSyntaxPlugin);
  if (config.imports === 'rollup-nodejs') {
    plugins.push(dynamicImportRollupNode);
  } else if (config.imports === 'rollup-webpack') {
    plugins.push(dynamicImportRollupPlugin);
  } else if (config.imports === 'webpack') {
    plugins.push(dynamicImportUniversalWebpack);
  }

  plugins.push([lodashPlugin, { id: config.optimizeModules }]);

  if (config.rewriteAsync === 'promises') {
    plugins.push([fastAsyncPlugin, { useRuntimeModule: true }]);
  }

  plugins.push(classPropertiesPlugin);
  plugins.push([
    objectRestSpreadPlugin,
    {
      useBuiltIns: options.useBuiltIns,
    },
  ]);

  plugins.push(parseJSX);

  plugins.push([
    transformRuntimePlugin,
    {
      helpers: true,
      regenerator: false,
      polyfill: false,
      useBuiltIns: options.useBuiltIns,
      useESModules: options.modules === false,
    },
  ]);

  if (config.framework === 'react') {
    plugins.push([
      transformReactJSX,
      {
        useBuiltIns: config.useBuiltIns,
        pragma: config.jsxPragma,
      },
    ]);
    plugins.push(reactIntlPlugin);
    plugins.push(reactInlineElementsPlugin);
    plugins.push(reactConstantElements);

    if (!isProd) {
      plugins.push(transformReactJSXSource);
      plugins.push(transformReactJSXSelf);
    }

    if (isProd) {
      plugins.push([
        transformRemovePropTypes,
        {
          mode: 'remove',
          removeImport: true,
        },
      ]);
    }
  }

  return {
    comments: config.comments,
    compact: true,
    minified: config.minified,
    sourceMaps: config.sourceMaps,
    presets,
    plugins,
  };
}
