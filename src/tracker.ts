import { setCustomEventListener } from './listener';

const trackEvents = ['click', 'mousedown', 'scroll'];
if (window) {
  setCustomEventListener((source: EventSource, type: string) => console.log('Event:', type));
}

