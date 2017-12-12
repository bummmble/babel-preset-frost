[![CircleCI](https://circleci.com/gh/bummmble/babel-preset-frost.svg?style=svg)](https://circleci.com/gh/bummmble/babel-preset-frost)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
# babel-preset-frost

> A modern Babel configuration for a pleasant development experience

## Features

- React and Flowtype Support baked in for handling JSX and eliminating non-standard Flowtype definitions
- [Lodash Plugin](https://github.com/lodash/babel-plugin-lodash) to allow cherry picking of larger, tragitionally exporte libraries such as lodash, async, rambda and recompose
- Support for converting up-and-coming ES standards such as class properties and object-rest-spread
- High performance async/await transpiling using [Fast Async](https://github.com/MatAtBread/fast-async) and [nodeent](https://github.com/MatAtBread/nodent#performance)
- Supports Dynamic CSS loading and automatic chunkNames using [universal-import](https://github.com/faceyspacey/babel-plugin-universal-import)
- Prefers External Polyfills and helpers instead of baked-in code which helps out largely with code-splitting and caching.
- Transpilation ignore Generators. Transpiling these results in super slow code.
- Provides Framework specific options for react during development (enhanced debug capabilities) and in production (a lot of code elimination and elements optimizations)

## Usage

### Default Configuration

```js
const defaults = {
    // Whether to print hints on the selected settings
    debug: false

    // One of the following
    // - 'node'/'nodejs'/'script'/'binary': any NodeJS execution with wide support to the last LTS
    // 'node8': Identical to the previous, but target the next coming LTS (Node v8.0.0)
    // 'current'/'test': Current Node Version
    // 'browser'/'web': Browsers as defined by browserslist
    // 'library': Used for publishing npm libraries
    // 'es2015': Same as 'library' but targets es2015 capable engines only
    // 'modern': Same as 'library' but targets more forward-looking engines than es2015
    // {}: any custom setup supported by Env-Preset
    target: 'nodejs'

    // Choose environment based on env variables.. or supply your own
    env: 'auto',

    // Choose automatically depending on target, or choose one
    // 'commonjs': Transpile module imports to cjs
    // false: Keep module imports as they are (this is required for tree-shaking)
    //'auto': Auto selection based on target
    modules: 'auto'

    // Choose automatically depdending on target, or choose one
    // - 'rollup-nodejs': For bundling with Rollup and later usage in Node (e.g. binaries)
    // - 'rollup-webpack': For bundling with Rollup and later usage with Webpack (e.g. libraries)
    // - 'webpack': Imrpoves compatibility with direct Webpack usage (e.g. Applications)
    // - 'auto': Automatic selection based on target
    imports: 'auto',

    // Prefer built-ins over custom code.
    useBuiltIns: true,

    // JSX Pragma. Default: Use React
    jsxPragma: 'React.createElement',

    // Async settings: Either 'promises' or 'null'
    rewriteAsync: 'promises',

    // Env Settings. Loose transpilation is on by default which is // efficient, but not overly compliant. If you have issues, it // might be better to switch 'looseMode' off
    looseMode: true,
    specMode: false,

    // Lodash Plugin Settings
    optimizeModules: ['lodash', 'async', 'rambda', 'recompose'],

    // Enable source map output
    sourceMaps: true,

    // Enable full compression on prod scripts or basic compression // (e.g. dead-code) for libs or during development
    compression: false,

    // Remove comments by default to keep libs leaner
    // Comments are automatically re-enabled if Webpack Universal   // Imports are used so they have the correct chunkNames
    comments: false,

    // Do not apply minification by default
    minified: false

    // Decides whether it should add specific presets and plugins for framework.
    // Right now only 'react' and 'none' are supported
    framework: 'react'
}
```

## Supported Targets

### Default Target

The default target is used when there are not tests being run and when no other 'target' was specified. This will transpile the code will the full feature set of 'babel-preset-latest' so the code will run on all ES5-capable engines. The compiled code does not contain any polyfills, so using 'polyfill.io' or 'babel-runtime' might be needed

### Modern Target

This is the current browserslist set-up for the modern stack.

```js
const modernTarget = {
    node: '8.2.0',
    electron: '1.6',
    browsers: [
        'Safari >= 10.1',
        'iOS >= 10.3',
        'Edge >= 15',
        'Chrome >= 59',
        'ChromeAndroid >= 59',
        'Firefox >= 53'
    ]
}
```
This preset is ideal during development to reduce the overall amount of transpilation to a useful minified to test with up-to-date browsers and environments. This allows you to benefit from the new features built directly into V8.

### ES2015 Target

This target attempts to offer a 'standardized es2015' compatible package which can be used in relatively modern engines. This is independent from any specific browserslist config. This config could possibly be used to create multiple builds for your app: one targeting classic browsers and the other es2015-compatible browsers

### Test Target

The 'test' target is generally suited for any test runner usage. It is enabled by default when no target is provided and 'NODE_ENV' is set to test. It exactly targets the current environment. For this reason, it is probably not a good idea to use outside of testing

### Browser Target

The Browser Target will match the build requirements for the 'browserslist' configuration of you project. This is ideal for any web related builds inside of your Application. It is not well-suited for other cases
