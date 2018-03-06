/**
 * cast module contains the start point to create an Ooyala player and install it on the
 * chromecast receiver app.
 *
 * @module cast
 */
import CastPlayer from './player'
import * as logger from 'loglevel'
import UIManager from './uiManager'
import Timer from './idleTimer'

import '../styles/player.css'

const CASTNAMESPACE = 'urn:x-cast:ooyala';
const LOG_PREFIX = 'MessageInterceptor:';
const castPlayer = new CastPlayer();

logger.setLevel(process.env.LOG_LEVEL);
UIManager.setStatusCast(UIManager.status.LOADING);
const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, loadRequestData => {
    logger.info(LOG_PREFIX, "LOAD", loadRequestData);
    castPlayer.setAsset(loadRequestData.media.customData);
    castPlayer.load();
    playerManager.setMediaElement(castPlayer.OOPlayer);
    return loadRequestData;
});

playerManager.setMessageInterceptor(cast.framework.messages.MessageType.PAUSE, requestData => {
    logger.info(LOG_PREFIX, "PAUSE", requestData);
    Timer.setIdle(Timer.TIMEOUT.PAUSED);
    castPlayer.pause();
    return requestData;
});

playerManager.setMessageInterceptor(cast.framework.messages.MessageType.PLAY, requestData => {
    logger.info(LOG_PREFIX, "PLAY", requestData);
    Timer.setIdle();
    castPlayer.play();
    return requestData;
});

playerManager.setMessageInterceptor(cast.framework.messages.MessageType.SET_VOLUME, volumeRequestData => {
    logger.info(LOG_PREFIX, "SET_VOLUME", volumeRequestData);
    castPlayer.setVolume(volumeRequestData.volume);
    return volumeRequestData;
});

playerManager.setMessageInterceptor(cast.framework.messages.MessageType.SEEK, seekRequestData => {
    logger.info(LOG_PREFIX, "SEEK", seekRequestData);
    castPlayer.seek(seekRequestData.currentTime);
    castPlayer.onSeeked(_, seekRequestData.currentTime);
    return seekRequestData;
});

context.addCustomMessageListener(CASTNAMESPACE, e => {
    castPlayer.getMessageHandler(e);
});

context.start();
