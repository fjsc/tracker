import { LogLevel, __LevelNumbers } from '../types/logger'

/**
 * Logger class provides logging feature to print debugging messages filtered by
 */
export class Logger {
  private static _filterLevel: number
  private static _instance: Logger

  private constructor() {}

  public static setConfig(level: LogLevel = LogLevel.OFF) {
    this._filterLevel = __LevelNumbers[level]
  }

  public static getInstance(): Logger {
    return this._instance || (this._instance = new this())
  }

  public debug(msg: string, ...supportingDetails: any[]): void {
    this._emitLogMessage(LogLevel.DEBUG, msg, supportingDetails)
  }

  public info(msg: string, ...supportingDetails: any[]): void {
    this._emitLogMessage(LogLevel.INFO, msg, supportingDetails)
  }

  public warn(msg: string, ...supportingDetails: any[]): void {
    this._emitLogMessage(LogLevel.WARNING, msg, supportingDetails)
  }

  public error(msg: string, ...supportingDetails: any[]): void {
    this._emitLogMessage(LogLevel.ERROR, msg, supportingDetails)
  }

  private _emitLogMessage(msgType: LogLevel, msg: string, supportingDetails: any[]): void {
    if (__LevelNumbers[msgType] >= Logger._filterLevel) {
      console[msgType](msg)
    }
  }
}
