import { expectType } from 'tsd'
import { typeLuminar } from '../src/index'

const parsed = typeLuminar({
   booleanLuminar: Boolean,
   booleanLuminarDefault: {
      type: Boolean,
      default: false,
   },
   stringLuminar: String,
   stringLuminarDefault: {
      type: String,
      default: 'hello',
   },
   numberLuminar: Number,
   numberLuminarDefault: {
      type: Number,
      default: 1,
   },
   extraOptions: {
      type: Boolean,
      alias: 'e',
      default: false,
      description: 'Some description',
   },
})

interface ExpectedType {
   luminars: {
      booleanLuminar: boolean | undefined
      booleanLuminarDefault: boolean
      stringLuminar: string | undefined
      stringLuminarDefault: string
      numberLuminar: number | undefined
      numberLuminarDefault: number
      extraOptions: boolean
   }
   unknownLuminars: {
      [luminar: string]: (string | boolean)[]
   }
   _: string[] & { '--': string[] }
}

expectType<ExpectedType>(parsed)
