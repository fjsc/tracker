declare global {
  interface Window {
    snowplow: any
    GlobalSnowplowNamespace: Array<any>
    snowplowNamespace: any
  }
}

interface Snowplow {}

export {}
