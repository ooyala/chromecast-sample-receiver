import * as logger from 'loglevel';
import Timer from './idleTimer';

const createMediaManagerFor = castPlayer => {
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
      if (event && event.data && event.data.autoplay) {
          Timer.setIdle();
      }
      castPlayer.setAsset(event.data.media.customData);
      if (castPlayer.OOPlayer != null) {
          const state = castPlayer.OOPlayer.getState();
          castPlayer.notifySenders(state);
      }
      mediaManager.origOnLoad(event);
    };
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
    };
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
    };
  })();

  return mediaManager;

};

export default {
  createMediaManagerFor
};