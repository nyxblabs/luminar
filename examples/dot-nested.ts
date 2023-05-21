/**
 * This example demonstrates how a dot-nested object can be created
 *
 * Usage:
 * $ npx tsx ./examples/dot-nested --env.TOKEN=123 --env.CI
 */
import consolji from 'consolji'
import { typeLuminar } from '../src/index'

interface Environment {
   TOKEN?: string
   CI?: boolean
}

function EnvironmentObject(value: string): Environment {
   const [propertyName, propertyValue] = value.split('=')
   return {
      [propertyName]: propertyValue || true,
   }
}

const parsed = typeLuminar({
   env: [EnvironmentObject],
})

const environment = parsed.luminars.env.reduce((agg, next) => Object.assign(agg, next), {})

consolji.log(environment)
