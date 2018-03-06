/**
 * idleTimer module. This module handles the creation of timeouts in order to detect
 * if the devices was not used for some time and shutdown the app session
 *
 * @module uiManager
 */
import * as logger from 'loglevel'

const timeout = {
    PAUSED: 1000 * 60 * 5, // 5 minutes
    IDLE: 1000 * 60 * 10 // 10 minutes
};

let idleTimerId = null;


/**
 * setIdle destroy any current timeout and creates a new one with the
 * given time
 *
 * @param {number} time
 */
function setIdle(time) {
    logger.info('Timer Idle for:', time);
    clearTimeout(idleTimerId);
    if (time) {
        idleTimerId = setTimeout(() => {
            cast.framework.CastReceiverContext.getInstance().stop();
        }, time)
    }
}

export default {
    setIdle: setIdle,
    TIMEOUT: timeout
}
