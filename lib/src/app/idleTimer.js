/**
 * idleTimer module. This module handles the creation of timeouts in order to detect
 * if the devices was not used for some time and shutdown the app session
 *
 * @module uiManager
 */
import * as logger from 'loglevel';
import castManager from './receiverManager';

/* eslint-disable no-magic-numbers */
const timeout = {
  PAUSED: 1000 * 60 * 5, // 5 minutes
  IDLE: 1000 * 60 * 10, // 10 minutes
};
/* eslint-enable no-magic-numbers */

let idleTimerId = null;

/**
 * setIdle destroy any current timeout and creates a new one with the
 * given time
 *
 * @param {number} time The time after which castManager should idle
 */
function setIdle (time) {
  logger.info('Timer Idle for:', time);
  clearTimeout(idleTimerId);
  if (time) {
    idleTimerId = setTimeout(() => {
      castManager.stop();
    }, time);
  }
}

export default {
  setIdle: setIdle,
  TIMEOUT: timeout,
};
