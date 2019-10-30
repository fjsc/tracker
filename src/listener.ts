/**
 * Wrap native addEventListener method
 */
export function setCustomEventListener(trackListenerHandler: (source: EventSource, type: string) => void) {
  const _originalEventListener = EventTarget.prototype.addEventListener;
  function wrapperEventListener<T>(
    this: EventSource,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ) {
    const _originalListener = listener;
    let customListener: EventListenerOrEventListenerObject
    if (typeof listener === 'function') {
      customListener = (evt: Event) => {
        trackListenerHandler(this, type)
        return (_originalListener as Function)(evt)
      }
    } else {
      customListener = _originalListener;
    }
    _originalEventListener.call(this, type, customListener, options)
  }
  EventTarget.prototype.addEventListener = wrapperEventListener;
}
