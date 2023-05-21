import { describe, expect, test } from 'vitest'
import { type Luminars, typeLuminar } from '../../src/index'

describe('luminar', () => {
   describe('Error handling', () => {
      describe('Invalid luminar name', () => {
         test('Empty luminar name', () => {
            expect(() => {
               typeLuminar({
                  '': String,
               }, [])
            }).toThrow(/* 'Invalid luminar name: empty' */)
         })

         test('Single character luminar name', () => {
            expect(() => {
               typeLuminar({
                  i: String,
               }, [])
            }).toThrow(/* 'Invalid luminar name: single characters are reserved for aliases' */)
         })

         test('Reserved characters', () => {
            expect(() => {
               typeLuminar({ 'luminar a': String }, [])
            }).toThrow(/* Flag name cannot contain the character " " */)

            expect(() => {
               typeLuminar({ 'luminar=b': String }, [])
            }).toThrow(/* Flag name cannot contain the character "=" */)

            expect(() => {
               typeLuminar({ 'luminar:c': String }, [])
            }).toThrow(/* Flag name cannot contain the character ":" */)

            expect(() => {
               typeLuminar({ 'luminar.d': String }, [])
            }).toThrow(/* Flag name cannot contain the character "." */)
         })

         test('Collision - camelCase to kebab-case', () => {
            expect(() => {
               typeLuminar({
                  'luminarA': String,
                  'luminar-a': String,
               }, [])
            }).toThrow(/* 'Invalid luminar name "luminarA": collides with luminar "luminar-a"' */)
         })

         test('Collision - kebab-case to camelCase', () => {
            expect(() => {
               typeLuminar({
                  'luminar-a': String,
                  'luminarA': String,
               }, [])
            }).toThrow(/* 'Invalid luminar name "luminar-a": collides with luminar "luminarA"' */)
         })
      })

      describe('Invalid alias', () => {
         test('Empty alias', () => {
            expect(() => {
               typeLuminar({
                  luminarA: {
                     type: String,
                     alias: '',
                  },
               }, [])
            }).toThrow(/* 'Empty alias' */)
         })

         test('Multi-character alias', () => {
            expect(() => {
               typeLuminar({
                  luminarA: {
                     type: String,
                     alias: 'luminar-a',
                  },
               }, [])
            }).toThrow(/* 'Multi character' */)
         })

         test('Collision - alias to alias', () => {
            expect(() => {
               typeLuminar({
                  luminarA: {
                     type: String,
                     alias: 'a',
                  },
                  luminarB: {
                     type: String,
                     alias: 'a',
                  },
               }, [])
            }).toThrow(/* 'Luminar collision: Alias "a" is already used' */)
         })
      })
   })

   describe('Types', () => {
      test('Errors', () => {
         typeLuminar({
            // @ts-expect-error only one element allowed
            luminarB: [String, String],

            // @ts-expect-error only one element allowed
            luminarC: {
               type: [String, String],
               alias: 'a',
            },
         }, [])
      })

      test('Readonly type', () => {
         typeLuminar({
            luminarA: {
               type: [String],
            },
         } as const, [])

         const readonly = <F extends Luminars>(
            options: Readonly<F>,
            argv: string[],
         ) => typeLuminar(options, argv)

         const parsed = readonly({
            luminarA: {
               type: String,
            },
            luminarB: {
               type: [String],
               default: () => ['world'],
            },
         }, ['--luminar-a', 'hello'])

         expect<string | undefined>(parsed.luminars.luminarA)
         expect<string[]>(parsed.luminars.luminarB)
      })
   })

   describe('Parsing', () => {
      describe('edge-cases', () => {
         test('Object prototype property', () => {
            const parsed = typeLuminar(
               {}, ['--to-string'],
            )
            expect(parsed.luminars).toStrictEqual({})
            expect(parsed.unknownLuminars).toStrictEqual({
               'to-string': [true],
            })
         })

         test('string to boolean', () => {
            const parsed = typeLuminar({
               boolean: Boolean,
            }, ['--boolean=value'])

            expect(parsed.luminars).toStrictEqual({
               boolean: true,
            })
         })

         test('end of luminars', () => {
            const parsed = typeLuminar({
               string: String,
            }, ['--string', '--', 'value'])

            expect(parsed.luminars).toStrictEqual({
               string: '',
            })

            expect<string[]>(parsed._).toStrictEqual(
               Object.assign(
                  ['value'],
                  { '--': ['value'] },
               ),
            )
         })

         test('Flag can start with _', () => {
            const parsed = typeLuminar({
               _luminar: Boolean,
            }, ['--_luminar'])

            expect(parsed.luminars).toStrictEqual({
               _luminar: true,
            })
         })

         test('invalid consolidated aliases', () => {
            const parsed = typeLuminar(
               {}, ['-invalidAlias'],
            )

            expect(parsed).toStrictEqual({
               _: Object.assign([], { '--': [] }),
               luminars: {},
               unknownLuminars: {
                  i: [true, true, true],
                  n: [true],
                  v: [true],
                  a: [true, true],
                  l: [true, true],
                  d: [true],
                  A: [true],
                  s: [true],
               },
            })
         })
      })

      test('end of luminars', () => {
         const argv = ['--luminarA', '--', '--luminarB']
         const parsed = typeLuminar(
            {
               luminarA: String,
               luminarB: String,
            },
            argv,
         )

         expect<string | undefined>(parsed.luminars.luminarA).toBe('')
         expect<string | undefined>(parsed.luminars.luminarB).toBe(undefined)
         expect<string[]>(parsed._).toStrictEqual(
            Object.assign(
               ['--luminarB'],
               {
                  '--': ['--luminarB'],
               },
            ),
         )
         expect(argv).toStrictEqual([])
      })

      test('strings, booleans, numbers', () => {
         const argv = ['--string', 'hello', '--boolean', 'world', '--string', '--number', '2', '--number']
         const parsed = typeLuminar(
            {
               string: String,
               boolean: Boolean,
               number: Number,
            },
            argv,
         )

         expect<string | undefined>(parsed.luminars.string).toBe('')
         expect<boolean | undefined>(parsed.luminars.boolean).toBe(true)
         expect<number | undefined>(parsed.luminars.number).toBe(Number.NaN)
         expect<string[]>(parsed._).toStrictEqual(
            Object.assign(
               ['world'],
               { '--': [] },
            ),
         )
         expect(argv).toStrictEqual([])
      })

      test('convert kebab-case to camelCase', () => {
         const argv = ['--some-string=2', '--someString=3', '--some-string=4']
         const parsed = typeLuminar(
            {
               someString: String,
            },
            argv,
         )

         expect<string | undefined>(parsed.luminars.someString).toBe('4')
         expect(argv).toStrictEqual([])
      })

      test('kebab-case luminars', () => {
         const argv = ['--some-string=2', '--someString=3', '--some-string=4']
         const parsed = typeLuminar(
            {
               'some-string': String,
            },
            argv,
         )

         expect<string | undefined>(parsed.luminars['some-string']).toBe('4')
         expect(!('someString' in parsed.luminars)).toBe(true)
         expect(argv).toStrictEqual([])
      })

      test('luminar=', () => {
         const argv = ['--string=hello', '-s=bye', '--string=', '--boolean=true', '--boolean=false', '--boolean=', 'world', '--number=3.14', '--number=']
         const parsed = typeLuminar(
            {
               string: {
                  type: String,
                  alias: 's',
               },
               boolean: Boolean,
               number: Number,
            },
            argv,
         )

         expect<string | undefined>(parsed.luminars.string).toBe('')
         expect<boolean | undefined>(parsed.luminars.boolean).toBe(true)
         expect<number | undefined>(parsed.luminars.number).toBe(Number.NaN)
         expect<string[]>(parsed._).toStrictEqual(
            Object.assign(
               ['world'],
               { '--': [] },
            ),
         )
         expect(argv).toStrictEqual([])
      })

      test('luminar: - to allow the use of = in values (or vice versa)', () => {
         const argv = ['--string:A=hello', '-s:B=bye']
         const parsed = typeLuminar(
            {
               string: {
                  type: String,
                  alias: 's',
               },
            },
            argv,
         )

         expect<string | undefined>(parsed.luminars.string).toBe('B=bye')
         expect(argv).toStrictEqual([])
      })

      test('luminar: . to allow dot-notation', () => {
         const argv = ['--string.A=hello', '-s.B=bye']
         const parsed = typeLuminar(
            {
               string: {
                  type: String,
                  alias: 's',
               },
            },
            argv,
         )

         expect<string | undefined>(parsed.luminars.string).toBe('B=bye')
         expect(argv).toStrictEqual([])
      })

      describe('aliases', () => {
         test('aliases', () => {
            const argv = ['-s', 'hello', '-b', 'world', '-1', 'goodbye']
            const parsed = typeLuminar(
               {
                  string: {
                     type: String,
                     alias: 's',
                  },
                  boolean: {
                     type: Boolean,
                     alias: 'b',
                  },
                  numberAlias: {
                     type: String,
                     alias: '1',
                  },
               },
               argv,
            )

            expect<string | undefined>(parsed.luminars.string).toBe('hello')
            expect<boolean | undefined>(parsed.luminars.boolean).toBe(true)
            expect<string | undefined>(parsed.luminars.numberAlias).toBe('goodbye')
            expect<string[]>(Object.keys(parsed.luminars)).toStrictEqual(['string', 'boolean', 'numberAlias'])
            expect<string[]>(parsed._).toStrictEqual(
               Object.assign(
                  ['world'],
                  { '--': [] },
               ),
            )
            expect(argv).toStrictEqual([])
         })

         test('alias with empty string', () => {
            const argv = ['-a']
            const parsed = typeLuminar(
               {
                  alias: {
                     type: [String],
                     alias: 'a',
                  },
               },
               argv,
            )

            expect<string[]>(parsed.luminars.alias).toStrictEqual([''])
            expect(argv).toStrictEqual([])
         })

         test('alias group with value', () => {
            const argv = ['-aliasesa=value']
            const parsed = typeLuminar(
               {
                  alias: {
                     type: [String],
                     alias: 'a',
                  },
               },
               argv,
            )

            expect<string[]>(parsed.luminars.alias).toStrictEqual(['', '', 'value'])
            expect(argv).toStrictEqual([])
         })
      })

      test('unknown luminars', () => {
         const argv = [
            '--unknownFlag',
            'arg1',
            '--unknownFlag=false',
            '--unknownFlag=',
            'arg2',
            '-u',
            'arg3',
            '-u=value',
            '-3',
            '-sdf',
            'arg4',
            '-ff=a',
            '--kebab-case',
            '--toString',
         ]
         const parsed = typeLuminar(
            {},
            argv,
         )

         expect<{
            [luminar: string]: never
         }>(parsed.luminars).toStrictEqual({})

         interface UnknownLuminars {
            [luminar: string]: (boolean | string)[]
         }

         expect<UnknownLuminars>(parsed.unknownLuminars).toStrictEqual({
            'unknownFlag': [true, 'false', ''],
            'u': [true, 'value'],
            '3': [true],
            's': [true],
            'd': [true],
            'f': [true, true, 'a'],
            'kebab-case': [true],
            'toString': [true],
         })
         expect<string[]>(parsed._).toStrictEqual(
            Object.assign(
               ['arg1', 'arg2', 'arg3', 'arg4'],
               { '--': [] },
            ),
         )
         expect(argv).toStrictEqual([])
      })

      describe('ignore', () => {
         test('specific known luminar', () => {
            const argv = ['--string', 'a', '--string=b', '--unknown', 'c', '--unknown=d', '-u', '-vvv=1']
            const parsed = typeLuminar(
               {
                  string: [String],
               },
               argv,
               {
                  ignore: (type, luminarName) => (
                     type === 'known-luminar'
                     && luminarName === 'string'
                  ),
               },
            )

            expect(parsed).toStrictEqual({
               luminars: {
                  string: [],
               },
               unknownLuminars: {
                  unknown: [true, 'd'],
                  u: [true],
                  v: [true, true, '1'],
               },
               _: Object.assign(
                  ['a', 'c'],
                  { '--': [] },
               ),
            })
            expect(argv).toStrictEqual(['--string', '--string=b'])
         })

         test('unknown luminars', () => {
            const argv = ['--string', 'a', '--string=b', '--unknown', 'c', '--unknown=d', '-u', '-vbv=1', '-us=d']
            const parsed = typeLuminar(
               {
                  string: {
                     type: [String],
                     alias: 's',
                  },
                  boolean: {
                     type: Boolean,
                     alias: 'b',
                  },
               },
               argv,
               {
                  ignore: type => type === 'unknown-luminar',
               },
            )

            expect(parsed).toStrictEqual({
               luminars: {
                  string: ['a', 'b', 'd'],
                  boolean: true,
               },
               unknownLuminars: {},
               _: Object.assign(
                  ['c'],
                  { '--': [] },
               ),
            })
            expect(argv).toStrictEqual(['--unknown', '--unknown=d', '-u', '-vv=1', '-u'])
         })

         test('after first argument', () => {
            const argv = ['--string', 'value', 'first-arg', '--string=b', '--string', 'c', '--unknown=d', '-u', '--', 'hello']

            let ignore = false
            const parsed = typeLuminar(
               {
                  string: [String],
               },
               argv,
               {
                  ignore(type) {
                     if (ignore)
                        return true

                     const isArgument = type === 'argument'
                     if (isArgument) {
                        ignore = isArgument
                        return isArgument
                     }
                  },
               },
            )

            expect(parsed).toStrictEqual({
               luminars: {
                  string: ['value'],
               },
               unknownLuminars: {},
               _: Object.assign(
                  [],
                  { '--': [] },
               ),
            })
            expect(argv).toStrictEqual(['first-arg', '--string=b', '--string', 'c', '--unknown=d', '-u', '--', 'hello'])
         })

         test('end of luminars', () => {
            const argv = ['--string', 'hello', 'a', '--', 'b', '--string=b', '--unknown', '--boolean']
            const parsed = typeLuminar(
               {
                  string: {
                     type: String,
                     alias: 's',
                  },
                  boolean: {
                     type: Boolean,
                     alias: 'b',
                  },
               },
               argv,
               {
                  ignore: (type, value) => (type === 'argument' && value === '--'),
               },
            )

            expect(parsed).toStrictEqual({
               luminars: {
                  string: 'hello',
                  boolean: undefined,
               },
               unknownLuminars: {},
               _: Object.assign(
                  ['a'],
                  { '--': [] },
               ),
            })
            expect(argv).toStrictEqual(['--', 'b', '--string=b', '--unknown', '--boolean'])
         })
      })

      test('custom type', () => {
         const ParseDate = (dateString: string) => new Date(dateString)

         const possibleJsFormats = ['cjs', 'esm', 'amd', 'umd'] as const
            type JsFormats = typeof possibleJsFormats[number]
            const JsFormat = (format: JsFormats) => {
               if (!possibleJsFormats.includes(format))
                  throw new Error(`Invalid format: "${format}"`)

               return format
            }

            const argv = [
               '--date=2011-05-03',
               '--format=esm',
            ]
            const parsed = typeLuminar(
               {
                  date: ParseDate,
                  format: JsFormat,
               },
               argv,
            )

            expect<Date | undefined>(parsed.luminars.date).toStrictEqual(ParseDate('2011-05-03'))
            expect<JsFormats | undefined>(parsed.luminars.format).toBe('esm')
            expect(argv).toStrictEqual([])
      })

      test('strings, booleans, numbers, array', () => {
         const argv = ['--boolean', 'world', '--number', '2', '--number', '--number-array', '1', '--number-array', '2', '--string-array', 'a', '--string-array', 'b']
         const parsed = typeLuminar(
            {
               string: String,
               boolean: Boolean,
               number: Number,
               stringArray: [String],
               numberArray: {
                  type: [Number],
               },
            },
            argv,
         )

         expect<string | undefined>(parsed.luminars.string).toBe(undefined)
         expect<boolean | undefined>(parsed.luminars.boolean).toBe(true)
         expect<number | undefined>(parsed.luminars.number).toBe(Number.NaN)
         expect<string[]>(parsed.luminars.stringArray).toStrictEqual(['a', 'b'])
         expect<number[]>(parsed.luminars.numberArray).toStrictEqual([1, 2])
         expect<string[]>(parsed._).toStrictEqual(
            Object.assign(
               ['world'],
               { '--': [] },
            ),
         )
         expect(argv).toStrictEqual([])
      })

      describe('Default luminar value', () => {
         test('Types and parsing', () => {
            const argv: string[] = []
            const parsed = typeLuminar(
               {
                  string: {
                     type: String,
                     default: 'hello world',
                  },

                  // Ideally, we can block this with a type error but not possible AFAIK
                  // Supporting reluctantly...
                  inconsistentTypes: {
                     type: Boolean,
                     default: 1,
                  },

                  inconsistentTypesB: {
                     type: Boolean,
                     default: undefined,
                  },

                  arrayOfStrings: {
                     type: [String],
                     default: () => ['hello'],
                  },

                  inconsistentTypesC: {
                     type: Number,
                     default: 'world',
                  },

                  noDefault: {
                     type: [String],
                  },
               },
               argv,
            )

            expect<string>(parsed.luminars.string).toBe('hello world')
            expect<boolean | number>(parsed.luminars.inconsistentTypes).toBe(1)
            expect<boolean | undefined>(parsed.luminars.inconsistentTypesB).toBe(undefined)
            expect<string[]>(parsed.luminars.arrayOfStrings).toStrictEqual(['hello'])
            expect<string | number>(parsed.luminars.inconsistentTypesC).toBe('world')
            expect<string[]>(parsed.luminars.noDefault).toStrictEqual([])
            expect(argv).toStrictEqual([])
         })
      })
   })
})
