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
    logger.setLevel(process.env.LOG_LEVEL);
    UIManager.setStatusCast(UIManager.status.LOADING);

    const castPlayer = new CastPlayer(namespace, pageLevelParameters);
    const mediaManager = new cast.receiver.MediaManager(castPlayer);

    /**
     * Exotic class method extending by Google devs
     * @see https://developers.google.com/cast/docs/custom_receiver (section Media)
     * onLoad assigns a new implementation of the onLoad event that can set the
     * needed information from the incoming event
     * @param {cast.receiver.MediaManager.Event} event
     */
    mediaManager.onLoad = (() => {
        mediaManager.origOnLoad = mediaManager.onLoad;
        return (event) => {
            logger.info('MediaManager:onLoad', event);
            const isAutoplayDesired = event && event.data && event.data.autoplay;
            if (isAutoplayDesired) {
                Timer.setIdle();
            }
            castPlayer.setAsset(event.data.media.customData);
            if (castPlayer.OOPlayer != null) {
                const state = castPlayer.OOPlayer.getState();
                castPlayer.notifySenders(state);
                if (isAutoplayDesired) {
                    castPlayer.play();
                }
            }
            mediaManager.origOnLoad(event);
        }
    })();

    /**
     * Exotic class method extending by Google devs
     * @see https://developers.google.com/cast/docs/custom_receiver (section Media)
     * onPause overrides the default behaviour to setup the default timeout
     * when an asset is being paused
     * @param {cast.receiver.MediaManager.Event} event
     */
    mediaManager.onPause = (() => {
        mediaManager.origOnPause = mediaManager.onPause;
        return (event) => {
            logger.info('MediaManager:onPause', event);
            Timer.setIdle(Timer.TIMEOUT.PAUSED);
            if (castPlayer.OOPlayer != null) {
                castPlayer.notifySenders(castPlayer.OOPlayer.getState());
            }
            mediaManager.origOnPause(event);
        }
    })();

    /**
     * Exotic class method extending by Google devs
     * @see https://developers.google.com/cast/docs/custom_receiver (section Media)
     * onPlay overrides the original logic for play() just to clear the timeout, if one was created
     * @param {cast.receiver.MediaManager.Event} event
     */
    mediaManager.onPlay = (() => {
        mediaManager.origOnPlay = mediaManager.onPlay;
        return (event) => {
            logger.info('MediaManager:onPlay', event);
            Timer.setIdle();
            mediaManager.origOnPlay(event);
        }
    })();

    castManager.start();
}
