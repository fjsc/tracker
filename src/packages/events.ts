import { TouchAiTrackEvents } from 'src/types/touchai'

/**
 * Wrap native addEventListener method
 */

/**
 * Track selected events when they are dispatched
 * @param events Valid trackable events
 */
export function trackEvents(events: Array<TouchAiTrackEvents>) {
  setTrackEventListeners(events)
}

function setTrackEventListeners(events: Array<TouchAiTrackEvents>) {
  const _originalEventListener = EventTarget.prototype.addEventListener

  function wrapperEventListener<T>(
    this: EventSource,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ) {
    const _originalListener = listener
    let customListener: EventListenerOrEventListenerObject

    if (events.includes(type as TouchAiTrackEvents) && typeof listener === 'function') {
      customListener = (evt: Event) => {
        registerEvent(type as TouchAiTrackEvents, this)
        return (_originalListener as Function)(evt)
      }
    } else {
      customListener = _originalListener
    }
    _originalEventListener.call(this, type, customListener, options)
  }

  EventTarget.prototype.addEventListener = wrapperEventListener
}

/**
 * Regist the event in snowplow
 * @param eventType
 * @param source
 */
function registerEvent(eventType: TouchAiTrackEvents, source: EventSource) {
  // TODO: Call snowplow tracker
  console.debug(`EVENT:, ${eventType} FROM SOURCE ${source}`)
}
