import '@fjsc/snowplow-tracker'
import { Touchai } from './packages/touchai'

const snowplow = window.snowplow

/**
 * Init snowplow and get a new instance
 */
snowplow(function(this: any) {
  const instance: any = this // TODO: Type instance
  try {
    const touchai = new Touchai(instance, snowplow)
  } catch (err) {
    console.error('TouchAI - Error', err)
  }
})
