/**
 * This example demonstrates how to count the number of flags
 *
 * Usage:
 * $ npx tsx ./examples/count-flags -vvv
 */
import consolji from 'consolji'
import { typeLuminar } from '../src/index'

const parsed = typeLuminar({
   verbose: {
      type: [Boolean],
      alias: 'v',
   },
})

consolji.log(parsed.luminars.verbose.length)
