declare global {
  interface Window {
    snowplow(callbackFn: Function): void
    GlobalSnowplowNamespace: Array<any>
    snowplowNamespace: any
  }
}

interface Snowplow {}

export {}
