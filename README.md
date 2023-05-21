[![cover][cover-src]][cover-href]
[![npm version][npm-version-src]][npm-version-href] 
[![npm downloads][npm-downloads-src]][npm-downloads-href] 
[![bundle][bundle-src]][bundle-href] [![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

# 🌕 luminar

Typed command-line arguments parser. Only 1.4 kB.

→ [Try it out online](https://stackblitz.com/edit/luminar-demo?devtoolsheight=50&file=src/luminar.ts&view=editor)


> _Looking for something more robust?_ 👀
>
> Try [**Zyro**](https://github.com/nyxblabs/zyro)—a CLI development tool powered by _luminar_.
>
> In addition to luminar parsing, it supports argument parsing and has a beautiful `--help` documentation generator.


<sub>Support this project by ⭐️ starring and sharing it. [Follow me](https://github.com/nyxb) to see what other cool projects I'm working on! 💙</sub>

## 📥 Install:

```bash
# nyxi
nyxi luminar

# pnpm
pnpm add luminar

# npm
npm i luminar

# yarn
yarn add luminar
```

## ⏱️ Quick start

_luminar_ offers a simple API to parse command-line arguments.

Let's say you want to create a script with the following usage:
```
$ my-script --name John --age 20
```

### 💡 typeLuminar

Here's how easy it is with _luminar_:
```ts
import { typeLuminar } from 'luminar'

const parsed = typeLuminar({
   name: String,
   age: {
      type: Number,
      alias: 'a'
   }
})

console.log(parsed.luminars.name) // 'John'
console.log(parsed.luminars.age) // 20
```

You can also get unknown luminars and arguments from the `parsed` object:
```ts
// object of unknown luminars passed in
console.log(parsed.unknownLuminars)

// arguments
console.log(parsed._)
```

### 🔦 getLuminar

_Want something even simpler?_

_luminar_ also exports a `getLuminar` function that returns a single luminar value.

```ts
import { getLuminar } from 'luminar'

const name = getLuminar('--name', String)
const age = getLuminar('-a,--age', Number)

console.log(name) // 'John'
console.log(age) // 20
```

These are quick demos but 🔮 _luminar_ can do so much more:
-  👥 Accept multiple luminar values
-  ➕ Luminar operators (e.g. `=`) for explicitly passing in a value
-  🧩 Parse unknown luminars
-  🔄 Parse alias groups (e.g. `-abc`)

Keep reading to learn more!

## 🧑‍💻 Usage

### 💡 Defining luminars

Pass in an object where the key is the luminar name and the value is the luminar type—a parser function that takes in a string and parses it to that type. Default JavaScript constructors should be able to cover most use-cases: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/String), [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number), [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean/Boolean), etc.

The value can also be an object with the `type` property as the luminar type.

```ts
typeLuminar({
   // Short-hand
   stringLuminar: String,
   numberLuminar: Number,
   booleanLuminar: Boolean,

   // Object syntax:
   stringLuminar: {
      type: String
   }
})
```

#### 📚 Array type

To accept multiple values of a luminar, wrap the type with an array:

```ts
const parsed = typeLuminar({
   myLuminar: [String]
})

// $ node ./cli --my-luminar A --my-luminar B
parsed.luminars.myLuminar // => ['A', 'B']
```

#### 🎭 Aliases

Luminars are often given single-character aliases for shorthand usage (eg. `--help` to `-h`). To give a luminar an alias, use the object syntax and set the `alias` property to a single-character name.

```ts
typeLuminar({
   myLuminar: {
      type: String,
      alias: 'm'
   }
})

// $ node ./cli -m hello
parsed.luminars.myLuminar // => 'hello'
```

#### 🏷️ Default values

Luminars that are not passed in will default to being `undefined`. To set a different default value, use the object syntax and pass in a value as the `default` property. When a default is provided, the return type will reflect that instead of `undefined`.

When using mutable values (eg. objects/arrays) as a default, pass in a function that creates it to avoid mutation-related bugs.

```ts
const parsed = typeLuminar({
   someNumber: {
      type: Number,
      default: 1
   },

   manyNumbers: {
      type: [Number],

      // Use a function to return an object or array
      default: () => [1, 2, 3]
   }
})
```

To get `undefined` in the parsed luminar type, make sure [`strict`](https://www.typescriptlang.org/tsconfig/#strict) or [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) is enabled.

### 🥙 kebab-case luminars mapped to camelCase 🐫

When passing in the luminars, they can be in kebab-case and will automatically map to the camelCase equivalent.
```ts
const parsed = typeLuminar({
   someString: [String]
})

// $ node ./cli --someString hello --some-string world
parsed.luminars.someString // => ['hello', 'world']
```

### ❓ Unknown luminars

When unrecognized luminars are passed in, they are interpreted as a boolean, or a string if explicitly passed in. Unknown luminars are not converted to camelCase to allow for accurate error handling.

```ts
const parsed = typeLuminar({})

// $ node ./cli --some-luminar --some-luminar=1234
parsed.unknownLuminars // => { 'some-luminar': [true, '1234'] }
```

### 📄 Arguments

Arguments are values passed in that are not associated with any luminars. All arguments are stored in the `_` property.

Everything after `--` (end-of-luminars) is treated as an argument (including luminars) and will be stored in the `_['--']` property.

```ts
const parsed = typeLuminar({
   myLuminar: [String]
})

// $ node ./cli --my-luminar value arg1 -- --my-luminar world
parsed.luminars.myLuminar // => ['value']
parsed._ // => ['arg1', '--my-luminar', 'world']
parsed._['--'] // => ['--my-luminar', 'world']
```

### 🌟 Luminar value delimiters

The characters `=`, `:` and `.` are reserved for delimiting the value from the luminar.

```sh
$ node ./cli luminar=value luminar:value luminar.value
```

This allows for usage like `--luminar:key=value` or `--luminar.property=value` to be possible.

### 🔀 Mutated argv array

When `luminar` iterates over the argv array, it removes the tokens it parses out via mutation.

By default, `luminar` works on a new copy of `process.argv.slice(2)` so this doesn't have any side-effects. But if you want to leverage this behavior to extract certain luminars and arguments, you can pass in your own copy of `process.argv.slice(2)`.

This may be useful for filtering out certain luminars before passing down the `argv` to a child process.

#### 🚫 Ignoring unknown luminars

Sometimes it may be undesirable to parse unknown luminars. In these cases, you can ignore them so they're left unparsed in the `argv` array.

```ts
const argv = process.argv.slice(2)
const parsed = typeLuminar(
   {},
   argv,
   {
      ignore: type => type === 'unknown-luminar'
   }
)

// $ node ./cli --unknown=hello
parsed._ // => []
argv // => ['--unknown=hello']
```

#### 🛑 Ignoring everything after the first argument

Similarly to how Node.js only reads luminars passed in before the first argument, _luminar_ can be configured to ignore everything after the first argument.

```ts
const argv = process.argv.slice(2)

let stopParsing = false
const parsed = typeLuminar(
   {
      myLuminar: [Boolean]
   },
   argv,
   {
      ignore(type) {
         if (stopParsing)
            return true

         const isArgument = type === 'argument'
         if (isArgument) {
            stopParsing = isArgument
            return stopParsing
         }
      }
   }
)

// $ node ./cli --my-luminar ./file.js --my-luminar
parsed.luminars.myLuminar // => [true]
argv // => ['./file.js', '--my-luminar']
```


## 👨🏻‍🏫 Examples

### ⚙️ Custom luminar type

Basic types can be set using [built-in functions in JavaScript](https://www.w3schools.com/js/js_object_constructors.asp#:~:text=Built-in%20JavaScript%20Constructors), but sometimes you want to a new type, narrow the type, or add validation.

To create a new type, simply declare a function that accepts a string argument and returns the parsed value with the expected type.

In this example, the `size` luminar is enforced to be either `small`, `medium` or `large`.
```ts
const possibleSizes = ['small', 'medium', 'large'] as const

type Sizes = typeof possibleSizes[number]

function Size(size: Sizes) {
   if (!possibleSizes.includes(size))
      throw new Error(`Invalid size: "${size}"`)

   return size
}

const parsed = typeLuminar({
   size: Size
})
```

`parsed` resolves to the following type:
```ts
interface Parsed {
   luminars: {
      size: 'small' | 'medium' | 'large' | undefined
   }
   // ...
}
```

### 🔄 Optional value luminar

To create a string luminar that acts as a boolean when nothing is passed in, create a custom type that returns both types.

```ts
function OptionalString(value: string) {
   if (!value)
      return true

   return value
}

const parsed = typeLuminar({
   string: OptionalString
})

// $ node ./cli --string
parsed.luminars.string // => true

// $ node ./cli --string hello
parsed.luminars.string // => 'hello'
```

### ⚡️ Accepting luminar values with `=` in it

In use-cases where luminar values contain `=`, you can use `:` instead. This allows luminars like `--define:K=V`.

```ts
const parsed = typeLuminar({
   define: String
})

// $ node ./cli --define:key=value
parsed.luminars.define // => 'key=value'
```

### 🌳 Dot-nested luminars

```ts
interface Environment {
   TOKEN?: string
   CI?: boolean
}

function EnvironmentObject(value: string): Environment {
   const [propertyName, propertyValue] = value.split('=')
   return {
      [propertyName]: propertyValue || true
   }
}

const parsed = typeLuminar({
   env: [EnvironmentObject]
})

const env = parsed.luminars.env.reduce(
   (agg, next) => Object.assign(agg, next),
   {}
)

// $ node ./cli --env.TOKEN=123 --env.CI
env // => { TOKEN: 123, CI: true }
```

### 🔁 Inverting a boolean

To invert a boolean luminar, `false` must be passed in with the `=` operator (or any other value delimiters).


```ts
const parsed = typeLuminar({
   booleanLuminar: Boolean
})

// $ node ./cli --boolean-luminar=false
parsed.luminars.booleanLuminar // => false
```

Without explicitly specfying the luminar value via `=`, the `false` will be parsed as a separate argument.

```ts
// $ node ./cli --boolean-luminar false
parsed.luminars.booleanLuminar // => true
parsed._ // => ['false']
```

### 🔢 Counting luminars

To create an API where passing in a luminar multiple times increases a count (a pretty common one is `-vvv`), you can use an array-boolean type and count the size of the array:

```ts
const parsed = typeLuminar({
   verbose: {
      type: [Boolean],
      alias: 'v'
   }
})

// $ node ./cli -vvv
parsed.luminars.verbose.length // => 3
```

## ⚙️ API

### 💡 typeLuminar(luminarSchema, argv, options)

Returns an object with the shape:
```ts
interface Parsed {
   luminars: {
      [luminarName: string]: InferredType
   }
   unknownLuminars: {
      [luminarName: string]: (string | boolean)[]
   }
   _: string[]
}
```

#### 📋 luminarSchema

Type:
```ts
type TypeFunction = (argvValue: any) => any

interface LuminarSchema {
   [luminarName: string]: TypeFunction | [TypeFunction] | {
      type: TypeFunction | [TypeFunction]
      alias?: string
      default?: any
   }
}
```


An object containing luminar schema definitions. Where the key is the luminar name, and the value is either the type function or an object containing the type function and/or alias.

#### 📄 argv

Type: `string[]`

Default: `process.argv.slice(2)`

The argv array to parse. The array is mutated to remove the parsed luminars.

#### ⚙️ options

Type:
```ts
interface Options {
   // Callback to skip parsing on certain argv tokens
   ignore?: (
      type: 'known-luminar' | 'unknown-luminar' | 'argument',
      luminarOrArgv: string,
      value: string | undefined,
   ) => boolean | void
}
```

---

### 🔦 getLuminar(luminarNames, luminarType, argv)

#### 📋 luminarNames

Type: `string`

A comma-separated list of luminar names to parse.

#### 🌟 luminarType

Type:
```ts
type TypeFunction = (argvValue: any) => any

type LuminarType = TypeFunction | [TypeFunction]
```

A function to parse the luminar value. Wrap the function in an array to retrieve all values.

#### 📄 argv

Type: `string[]`

Default: `process.argv.slice(2)`

The argv array to parse. The array is mutated to remove the parsed luminars.

## 📜 License

[MIT](./LICENSE) - Made with 💞

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/luminar?style=flat&colorA=18181B&colorB=14F195
[npm-version-href]: https://npmjs.com/package/luminar
[npm-downloads-src]: https://img.shields.io/npm/dm/luminar?style=flat&colorA=18181B&colorB=14F195
[npm-downloads-href]: https://npmjs.com/package/luminar
[bundle-src]: https://img.shields.io/bundlephobia/minzip/luminar?style=flat&colorA=18181B&colorB=14F195
[bundle-href]: https://bundlephobia.com/result?p=luminar
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=14F195
[jsdocs-href]: https://www.jsdocs.io/package/luminar
[license-src]: https://img.shields.io/github/license/nyxblabs/luminar.svg?style=flat&colorA=18181B&colorB=14F195
[license-href]: https://github.com/nyxblabs/luminar/blob/main/LICENSE

<!-- Cover -->
[cover-src]: https://raw.githubusercontent.com/nyxblabs/luminar/main/.github/assets/cover-github-luminar.png
[cover-href]: https://💻nyxb.ws
