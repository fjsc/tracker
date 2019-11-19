/*
 * © 2017 Stratio Big Data Inc., Sucursal en España. All rights reserved.
 *
 * This software – including all its source code – contains proprietary
 * information of Stratio Big Data Inc., Sucursal en España and
 * may not be revealed, sold, transferred, modified, distributed or
 * otherwise made available, licensed or sublicensed to third parties;
 * nor reverse engineered, disassembled or decompiled, without express
 * written authorization from Stratio Big Data Inc., Sucursal en España.
 */

import '@fjsc/snowplow-tracker'
import { TouchaiConfiguration } from './types/touchai'
import { Logger } from './utils/logger'

const snowplow = window.snowplow
const logger = Logger.getInstance()

/**
 * Initialize Touchai from config
 * @param config
 */
export function init(config: TouchaiConfiguration) {
  Logger.setConfig(config.debug)
  const snowplowConfig = config.snowplow
  touchaiSnowplowExecution(
    'newTracker',
    'cf',
    snowplowConfig.collector,
    snowplowConfig.trackerConfig
  )
  touchaiConfigureSnowplowCallback()
}

/**
 * Init snowplow and get a new instance
 */
function touchaiSnowplowExecution(event: string, ...args: any) {
  logger.debug('Snowplow execute: ' + event, args)

  // execute snowplow native functions
  try {
    snowplow(event, ...args)
  } catch (err) {
    logger.error('TouchAI - The Snowplow tracker is not ready')
  }
}

function touchaiConfigureSnowplowCallback() {
  // Configure snowplow callback to init touchai tracker after snowplow
  snowplow(function() {
    try {
      // window.touchai.init(this)
    } catch (err) {
      logger.error('TouchAI - Error', err)
    }
  })
  logger.debug('Snowplow callback configured')
}
