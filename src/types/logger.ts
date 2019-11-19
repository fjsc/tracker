export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warn',
  ERROR = 'error',
  OFF = ''
}

export const __LevelNumbers = {
  [LogLevel.OFF]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.WARNING]: 3,
  [LogLevel.ERROR]: 4
}
