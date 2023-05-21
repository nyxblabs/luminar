/**
 * This example demonstrates how to invert a boolean flag
 *
 * Usage:
 * $ npx tsx ./examples/invert-boolean --boolean=false
 */
import consolji from 'consolji'
import { typeLuminar } from '../src/index'

const parsed = typeLuminar({
   boolean: Boolean,
})

consolji.log(parsed.luminars.boolean)
