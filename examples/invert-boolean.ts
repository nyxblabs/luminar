/**
 * This example demonstrates how to invert a boolean flag
 *
 * Usage:
 * $ npx tsx ./examples/invert-boolean --boolean=false
 */
import consolji from 'consolji'
import { typeFlag } from '#luminar'

const parsed = typeFlag({
   boolean: Boolean,
})

consolji.log(parsed.flags.boolean)
