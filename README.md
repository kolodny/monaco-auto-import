# monaco-auto-import


[![npm version](https://img.shields.io/npm/v/@kolodny/monaco-auto-import.svg?style=flat-square)](https://www.npmjs.com/package/@kolodny/monaco-auto-import)
[![npm downloads](https://img.shields.io/npm/dm/@kolodny/monaco-auto-import.svg?style=flat-square)](https://www.npmjs.com/package/@kolodny/monaco-auto-import)
[![Demo](https://img.shields.io/badge/Online-Demo-yellow.svg?style=flat-square)](https://unpkg.com/@kolodny/monaco-auto-import/dist/index.html)

Forked from https://github.com/stackblitz/monaco-auto-import


Easily add auto-import to the Monaco editor, with Javascript & Typescript support.

## Demo

![](https://i.imgur.com/BvQuMRC.gif)

### Example code

```ts
import AutoImport, { regexTokeniser } from '@kolodny/monaco-auto-import'

const editor = monaco.editor.create(document.getElementById('demo'), {
  value: `
    PAD
    leftPad
    rightPad
  `,
  language: 'typescript'
})

const completor = new AutoImport({ monaco, editor })

completor.imports.saveFiles([
  {
    path: './node_modules/left-pad/index.js',
    aliases: ['left-pad'],
    imports: regexTokeniser(`
      export const PAD = ''
      export function leftPad() {}
      export function rightPad() {}
    `)
  }
])
```

## Getting started

### Installing

```bash
yarn add @kolodny/monaco-auto-import
# or
npm i @kolodny/monaco-auto-import --save
```

### Using

#### Initializing a new instance

Simply create a new Monaco editor instance and pass it to `AutoImport`. This will register custom completion providers for Monaco's `javascript` and `typescript` language services.

```ts
import AutoImport from '@kolodny/monaco-auto-import'

const editor = monaco.editor.create(document.getElementById('demo'), {
  language: 'typescript'
})

const completor = new AutoImport({ monaco, editor })
```

#### Providing completion items

To make the auto-importer aware of a file with exports, simply call `completor.imports.saveFile`.

```ts
completor.imports.saveFile({
  path: './src/my-app.js',
  imports: [
    {
      type: 'const',
      name: 'Testing'
    }
  ]
})
```

![](https://i.imgur.com/zSuZr7j.png)

#### Tokenization

This package includes a built-in `regexTokeniser`, which uses a simple Regex to extracts exports from Javascript / Typescript code

```ts
import { regexTokeniser } from '@kolodny/monaco-auto-import'

const imports = regexTokeniser(`
  export const a = 1
  export class Test {}
`)
// [{ type: 'const', name: 'a'}, { type: 'class', name: 'Test' }]

completor.imports.saveFile({
  path: './src/my-app.js',
  imports: imports
})
```

## API

### `imports.saveFile(file: File): void`

Saves a file to the internal store, making it available for completion

### `imports.saveFiles(files: File[]): void`

Bulk-saves files to the internal store from an Array of files

### `imports.getFile(path: string): File`

Fetches a file from the internal store by it's path name (or one of it's aliases).

### `imports.getImports(name: string): ImportObject[]`

Returns all the imports that exactly match a given string.

### `imports.addImport(path: string, name: string, type?: Expression): boolean`

Adds an import to a given file, with an optional `type` paramater. Returns true if the file existed

### `imports.removeImport(path: string, name: string): boolean`

Removes an import from a given file. Returns true if the file existed
