/**
 * idleTimer module. This module handles the creation of timeouts in order to detect
 * if the devices was not used for some time and shutdown the app session
 *
 * @module uiManager
 */
import * as logger from 'loglevel';
import castManager from './receiverManager';

const timeout = {
<<<<<<< HEAD
    PAUSED: 1000 * 60 * 5, // 5 minutes
    IDLE: 1000 * 60 * 10 // 10 minutes
=======
  PAUSED: 1000 * 60 * 5, // 5 minutes
  IDLE: 1000 * 60 * 10, // 5 minutes
>>>>>>> e1f1e73dbca7707c6d18671f9dcad7003e62731a
};

let idleTimerId = null;

/**
 * setIdle destroy any current timeout and creates a new one with the
 * given time
 *
 * @param {number} time
 */
<<<<<<< HEAD
function setIdle(time) {
    logger.info('Timer Idle for:', time);
    clearTimeout(idleTimerId);
    if (time) {
        idleTimerId = setTimeout(castManager.stop, time);
    }
=======
function setIdle (time) {
  logger.info('Timer Idle for:', time);
  clearTimeout(idleTimerId);
  if (time) {
    idleTimerId = setTimeout(() => {
      castManager.stop();
    }, time);
  }
>>>>>>> e1f1e73dbca7707c6d18671f9dcad7003e62731a
}

export default {
  setIdle: setIdle,
  TIMEOUT: timeout,
};
