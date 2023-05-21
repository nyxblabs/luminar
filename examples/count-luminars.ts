/**
 * This example demonstrates how to count the number of flags
 *
 * Usage:
 * $ npx tsx ./examples/count-flags -vvv
 */
import consolji from 'consolji'
import { typeFlag } from '#luminar'

const parsed = typeFlag({
   verbose: {
      type: [Boolean],
      alias: 'v',
   },
})

consolji.log(parsed.flags.verbose.length)
