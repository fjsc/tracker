const snowplowNamespace = 'snowplow'

// snowplow configuration
if (!window[snowplowNamespace]) {
  window.GlobalSnowplowNamespace = window.GlobalSnowplowNamespace || []
  window.GlobalSnowplowNamespace.push(snowplowNamespace)
  window[snowplowNamespace] = function() {
    ;(window[snowplowNamespace].q = window[snowplowNamespace].q || []).push(arguments)
  }
  window[snowplowNamespace].q = window[snowplowNamespace].q || []
}

export * from './init'
