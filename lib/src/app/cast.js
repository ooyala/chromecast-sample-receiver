/* global cast */

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
import Timer from './idleTimer';

import '../styles/player.css';

/**
 * Assigns events listeners to MediaManager and starts casting
 * @param {string} namespace - namespace to listen to
 * @param {PageLevelParameters} [pageLevelParameters]
 */
export function init(namespace, pageLevelParameters) {
    var mediaManager = null;
    var castPlayer = new CastPlayer(namespace, pageLevelParameters);

    logger.setLevel(process.env.LOG_LEVEL);
    UIManager.setStatusCast(UIManager.status.LOADING);

    // create a new instance of the Media Manager to interact with the sender app request
    mediaManager = new cast.receiver.MediaManager(castPlayer);

    // backup of the original onLoad event handler to use it after our custom logic
    mediaManager.origOnLoad = mediaManager.onLoad;

    /**
     * onLoad assign a new implementation of the onLoad event that can sets the needed information from the
     * incoming event
     * @param {cast.receiver.MediaManager.Event} event
     */
    mediaManager.onLoad = function(event) {
        logger.info('MediaManager:onLoad', event);
        if (event && event.data && event.data.autoplay) {
            Timer.setIdle();
        }
        castPlayer.setAsset(event.data.media.customData);
        if (castPlayer.OOPlayer != null) {
            castPlayer.notifySenders(castPlayer.OOPlayer.getState());
        }
        mediaManager.origOnLoad(event);
    };

    // backup of the original onPause event handler to use it after our custom logic
    mediaManager.origPause = mediaManager.onPause;

    /**
     * onPause overrides the default behaviour to setup the default timeout when an assets it's getting paused
     */
    mediaManager.onPause = function(e) {
        logger.info('MediaManager:onPause', e);
        Timer.setIdle(Timer.TIMEOUT.PAUSED);
        if (castPlayer.OOPlayer != null) {
            castPlayer.notifySenders(castPlayer.OOPlayer.getState());
        }
        mediaManager.origPause(e);
    };

    // backup of the original onPlay event handler to use it after our custom logic
    mediaManager.origPlay = mediaManager.onPlay;

    /**
     * onPlay override the original logic for play just to clear the timeout, if one was created
     */
    mediaManager.onPlay = function(e) {
        logger.info('MediaManager:onPlay', e);
        Timer.setIdle();
        mediaManager.origPlay(e);
    };

    castManager.start();
}
