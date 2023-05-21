/**
 * This example demonstrates how to create a custom type
 *
 * Usage:
 * $ npx tsx ./examples/count-flags --size medium
 */
import consolji from 'consolji'
import { typeLuminar } from '../src/index'

const possibleSizes = ['small', 'medium', 'large'] as const

type Sizes = typeof possibleSizes[number]

function Size(size: Sizes) {
   if (!possibleSizes.includes(size))
      throw new Error(`Invalid size: "${size}"`)

   return size
}

const parsed = typeLuminar({
   size: {
      type: Size,
   },
})

consolji.log(parsed.luminars)
