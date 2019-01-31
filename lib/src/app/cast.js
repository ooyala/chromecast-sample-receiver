/**
 * cast module contains the start point to create an Ooyala player and install it on the
 * chromecast receiver app.
 *
 * @module cast
 */
import castManager from './receiverManager';
import CastPlayer from './player';
import * as logger from 'loglevel';
import UIManager from './uiManager';
import mediaManager from './mediaManager';

/* global cast */
import '../styles/player.css';

/**
 * Assigns events listeners to MediaManager and starts casting
 * @param {string} namespace - namespace to listen to
 * @param {object} pageLevelParameters - page level parameters
 */
export function init (namespace, pageLevelParameters) {
  logger.setLevel(process.env.LOG_LEVEL);
  UIManager.setStatusCast(UIManager.status.LOADING);

  const castPlayer = new CastPlayer(namespace, pageLevelParameters);

  mediaManager.createMediaManagerFor(castPlayer);

  castManager.start();
}
