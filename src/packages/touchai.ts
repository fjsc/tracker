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

import * as fingerprint from 'fingerprintjs2'

import { getCookie, setCookie } from 'src/utils'
import { TOUCHAI_COOKIE_NAME } from 'src/constants'
import { Logger } from 'src/utils/logger'

const logger = Logger.getInstance()

export class Touchai {
  private _config: any
  private _spInstance: any

  constructor(public spInstance: any, private _snowplow: any) {
    // TODO: Where is the config??
    if (!_snowplow) {
      throw new Error('Snowplow instance cannot be found')
    }
    this._spInstance = spInstance
    this._snowplow = window.snowplow
    this.initStaticAppTracking()
  }

  public initStaticAppTracking() {
    // Enable page pings (must be called before trackPageView)
    if (this._config.enableActivityTracking) {
      this._snowplow('enableActivityTracking', this._config.enableActivityTracking)
    }
    // We attach the formTrack for the first time
    if (this._config.enableFormTrack) {
      this._snowplow('enableFormTracking', this._config.formTrackConfig)
    }
    // Initialize crossdomain tracker
    if (this._config.crossDomain && this._config.crossDomain.crossdomainEnabled) {
      this._initCrossdomainTracker(this._config.crossDomain.crossdomainUrl, this._spInstance)
    }
  }

  private _initCrossdomainTracker(crossdomainUrl: string, spInstance: any) {
    const fullCrossdomainUrl = location.protocol + '//' + crossdomainUrl + '/tracker?'
    const cf = spInstance.cf
    if (!cf) {
      // the tracker is asynchronous, so, if the user doesn't call newTracker method soon,
      // this method is called before the tracker is ready
      logger.warn(
        'Crossdomain tracker is disabled because the Snowplow tracker is not ready! ' +
          "Initialize the crossdomain tracker after window.snowplow('newTracker', 'cf' ..."
      )
      return
    }
    const spUid = cf.getDomainUserId()
    const spFingerprint = cf.getUserFingerprint()
    // call to stratio touchai code
    // delay it for a few milliseconds with setTimeout to ensure consistent fingerprints
    this._executeCrossdomainTracker(fullCrossdomainUrl, spUid, spFingerprint)
  }

  private _executeCrossdomainTracker(
    fullCrossdomainUrl: string,
    spUid: string,
    spFingerprint: string
  ): void {
    // check if the cookie already exists
    let isValidCookie = false
    const stratioCookie = getCookie(TOUCHAI_COOKIE_NAME)
    if (stratioCookie && stratioCookie === spUid) {
      isValidCookie = true
    } else if (!stratioCookie) {
      logger.debug('crossdomain tracker: Cookie NOT FOUND')
    } else if (stratioCookie !== spUid) {
      logger.debug('Crossdomain tracker: Cookie OUTDATED')
    }

    // if the cookie is not valid, generate new fingerprint
    if (!isValidCookie) {
      const domain = window.location.hostname

      fingerprint.get(components => {
        const fp2Hash = fingerprint.x64hash128(
          components
            .map(function(pair) {
              return pair.value
            })
            .join(),
          31
        )
        // load stratio tracker through image pixel hack
        const paramsDict = {
          domain: domain,
          sp_uid: spUid,
          sp_fingerprint: spFingerprint,
          f2_fingerprint: fp2Hash
        }
        this._loadPixelImage(fullCrossdomainUrl, paramsDict, spUid)
      })
    }
  }

  private _loadPixelImage(fullCrossdomainUrl: string, paramsDict: any, spUid: string) {
    // encode url params
    const str = []
    for (let p in paramsDict) {
      if (paramsDict.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(paramsDict[p]))
      }
    }
    const params = str.join('&')
    // load pixel image
    const img: HTMLImageElement = document.createElement('img')
    img.style.display = 'none'
    img.onload = function() {
      // save stratio cookie only if the url was loaded sucessfully
      setCookie(TOUCHAI_COOKIE_NAME, spUid, 1000)
      // remove the pixel image
      img.remove()
    }
    img.src = fullCrossdomainUrl + params
    document.body.appendChild(img)
  }
}
