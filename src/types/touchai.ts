import { LogLevel } from './logger'

export interface TouchaiConfiguration {
  snowplow: TouchaiSnowplowConfig
  crossDomain?: CrossDomainConfig
  enableApiTrack: boolean
  enableEventsTrack: Array<TouchAiTrackEvents>
  enableRoutingTrack: boolean
  enableFormTrack: boolean
  formTrackConfig?: TouchaiFormConfig
  enableActivityTracking?: TouchaiActivityTrackingConfig
  debug?: LogLevel
}

export interface TouchaiSnowplowConfig {
  collector: string
  trackerConfig: TouchaiSnowplowTrackerConfig
}

export interface TouchaiSnowplowTrackerConfig {
  encodeBase64: boolean
  appId: string
  platform: TouchaiChannels
  contexts?: any
}

export enum TouchaiChannels {
  WEB = 'web', // Web (including Mobile Web)
  MOBILE = 'mob', // Mobile/Tablet
  APP = 'app' // General App
}

export interface CrossDomainConfig {
  crossdomainEnabled: boolean
  crossdomainUrl: string
}

export interface TouchaiFormConfig {
  forms?: {
    whitelist?: string[]
    blacklist?: string[]
  }
  fields?: {
    whiteList?: string[]
    blacklist?: string[]
  }
}

export enum TouchAiTrackEvents {
  Click = 'click',
  MouseDown = 'mousedown',
  Scroll = 'scroll'
}

export interface TouchaiActivityTrackingConfig {
  minimumVisitLength: number
  heartBeat: number
}
