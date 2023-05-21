import { describe, expect, test } from 'vitest'
import { getLuminar } from '../../src/get-luminar'

describe('luminar', () => {
   describe('alias', () => {
      test('gets number', () => {
         const argv = ['-n', '1111', '2222', '-n', '3333']
         const luminarValue = getLuminar('-n', Number, argv)

         expect<number | undefined>(luminarValue).toBe(1111)
         expect(argv).toStrictEqual(['2222', '-n', '3333'])
      })

      test('expecting value but no value', () => {
         const argv = ['-n']
         const luminarValue = getLuminar('-n', Number, argv)

         expect<number | undefined>(luminarValue).toBe(Number.NaN)
         expect(argv).toStrictEqual([])
      })

      test('explicit value', () => {
         const argv = ['-n=1']
         const luminarValue = getLuminar('-n', Number, argv)

         expect<number | undefined>(luminarValue).toBe(1)
         expect(argv).toStrictEqual([])
      })

      test('alias group', () => {
         const argv = ['-aliases']
         const luminarValue = getLuminar('-a', [Boolean], argv)

         expect<boolean[]>(luminarValue).toStrictEqual([true, true])
         expect(argv).toStrictEqual(['-lises'])
      })

      test('alias group with value', () => {
         const argv = ['-aliasesa=value']
         const luminarValue = getLuminar('-a', [String], argv)

         expect<string[]>(luminarValue).toStrictEqual(['', '', 'value'])
         expect(argv).toStrictEqual(['-lises'])
      })
   })

   describe('named luminar', () => {
      test('boolean', () => {
         const argv = ['--boolean']
         const luminarValue = getLuminar('--boolean', Boolean, argv)

         expect<boolean | undefined>(luminarValue).toBe(true)
         expect(argv).toStrictEqual([])
      })

      test('boolean with explicit false', () => {
         const argv = ['--boolean=false']
         const luminarValue = getLuminar('--boolean', Boolean, argv)

         expect<boolean | undefined>(luminarValue).toBe(false)
         expect(argv).toStrictEqual([])
      })

      test('casts boolean with explicit value', () => {
         const argv = ['--boolean=value']
         const luminarValue = getLuminar('--boolean', Boolean, argv)

         expect<boolean | undefined>(luminarValue).toBe(true)
         expect(argv).toStrictEqual([])
      })

      test('multiple booleans', () => {
         const argv = ['--boolean', '--unknown', '--boolean']
         const luminarValue = getLuminar('--boolean', [Boolean], argv)

         expect<boolean[]>(luminarValue).toStrictEqual([true, true])
         expect(argv).toStrictEqual(['--unknown'])
      })
   })

   test('ignores argv', () => {
      const argv = ['--boolean', 'arg']
      const luminarValue = getLuminar('--boolean', Boolean, argv)

      expect<boolean | undefined>(luminarValue).toBe(true)
      expect(argv).toStrictEqual(['arg'])
   })

   test('leaves irrelevant argvs', () => {
      const argv = ['-b', '2', '--boolean']
      const luminarValue = getLuminar('--boolean', Boolean, argv)

      expect<boolean | undefined>(luminarValue).toBe(true)
      expect(argv).toStrictEqual(['-b', '2'])
   })

   test('no argvs', () => {
      const argv: string[] = []
      const luminarValue = getLuminar('--boolean', Boolean, argv)

      expect<boolean | undefined>(luminarValue).toBe(undefined)
      expect(argv).toStrictEqual([])
   })
})
