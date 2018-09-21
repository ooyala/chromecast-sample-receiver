/* global OO */
/* global cast */
import * as logger from 'loglevel';

import { createPageLevelParameters } from './helpers/createPageLevelParameters';
import castManager from './receiverManager';
import UIManager from './uiManager';

// Namespaces used to create a message bus on the Google Cast SDK.
const GOOGLE_CAST_PREFIX = 'urn:x-cast:';
const CAST_NAMESPACE = GOOGLE_CAST_PREFIX + 'ooyala';

// Namespace used to listen Ooyala Player events.
const PLAYER_NAMESPACE = 'chromecast';

// Prefix used to build log messages from this module.
const LOG_PREFIX = 'Player:';

/**
 * CastPlayer implements `cast.receiver.media.Player` interface from Google Cast SDK for
 * receivers. This class responds to `MediaManager` requests and proxy them to the Ooyala
 * Player API.
 *
 * @class
 * @implements {cast.receiver.media.Player}
 * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player
 */
class CastPlayer {
  /**
   * Creates an instance of `CastPlayer`. Assigns events listeners to `MediaManager` and
   * starts casting.
   *
   * @param {string} [namespace='urn:x-cast:ooyala'] - namespace to listen for events from message bus
   * @param {PageLevelParameters} pageLevelParameters - page-level parameters for Player V4
   * @see https://help.ooyala.com/video-platform/api/pbv4_api_embedparams.html
   */
  constructor (namespace = CAST_NAMESPACE, pageLevelParameters) {
    /**
     * Was the asset played once or not? Switched to true by `onPlayed()` method,
     * switched to false when `onPlayheadChanged()` triggered. Used to replay the same
     * asset.
     * @type {boolean}
     */
    this.isCompleted = false;

    // get player parameters
    this.OOPlayer = null;
    this.endedCallback = null;
    this.errorCallback = null;
    this.loadCallback = null;
    this.idleTimerId = null;
    this.skinInstance = null;
    this.ec = null;
    this.mb = null;
    this.state = cast.receiver.media.PlayerState.IDLE;
    this.playhead = {};

    // clone pageLevelParameters overrides to this.params
    this.params = createPageLevelParameters(
      pageLevelParameters,
      this.onCreateHandlers.bind(this)
    );
    this.onCreate = pageLevelParameters.onCreate;
    this.setMessageBus(namespace);
  }

  /**
   * setAsset method receives the custom data from the LOAD request on the Media Manager
   * and will extract the embedcode and params. The params could be passed from the
   * sender as a JSON object or string, if the typeof is string a conversion to Object
   * will be perfomed. The params object will be merged with the default values for the
   * Ooyala Player.
   *
   * @param {Object} data - custom data from sender
   */
  setAsset (data) {
    this.ec = data.ec || null;

    if (typeof data.params === 'string') {
      logger.warn(LOG_PREFIX, 'Params are not a proper JSON object:', data.params);

      try {
        // TODO: Once PBA fixes the issue with params as strings, please change
        // this line to JSON.parse method.
        /* eslint-disable no-eval */
        data.params = eval('(' + data.params + ')');
        /* eslint-enable no-eval */
      } catch (e) {
        logger.error(LOG_PREFIX, 'Cannot parse params:', e);
      }
    }
    const params = { ...this.params };
    if (typeof data.params === 'object') {
      Object.assign(params, data.params);
    }
    this.params = createPageLevelParameters(
      params,
      this.onCreateHandlers.bind(this)
    );
    logger.info(LOG_PREFIX, 'Asset params:', this.params);
  }

  /**
   * setMessageBus creates a message bus with the namespace defined at `CAST_NAMESPACE`.
   *
   * @param {string} [namespace='urn:x-cast:ooyala'] - namespace to subscribe to
   */
  setMessageBus (namespace) {
    // check if namespace is valid and not null
    let castNamespace = '';

    // check if namespace exists
    if (namespace && typeof namespace === 'string') {
      // check if namespace will be validated by google
      if (namespace.lastIndexOf(GOOGLE_CAST_PREFIX, 0) !== 0) {
        throw new Error(
          `Invalid namespace provided, please prefix your namespace with ${GOOGLE_CAST_PREFIX}`
        );
      } else {
        castNamespace = namespace;
      }
    } else {
      castNamespace = CAST_NAMESPACE;
    }

    // save message bus from CastReceiverManager#getCastMessageBus to mb field of the
    // receiver
    this.mb = castManager.getCastMessageBus(
      castNamespace,
      cast.receiver.CastMessageBus.MessageType.JSON
    );

    this.mb.onMessage = this.getMessageHandler.bind(this);
  }

  /**
   * getMessageHandler handles the incoming events at the created message bus and
   * responds for each type of incoming actions on the message request.
   *
   * @param {cast.receiver.CastMessageBus.Event} e
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.CastMessageBus.Event
   */
  getMessageHandler (e) {
    logger.info(LOG_PREFIX, 'MessageBus Action:', e.data.action);

    switch (e.data.action) {
      case 'setCCLanguage':
        this.setClosedCaptions(e.data.data);
        break;

      case 'getstatus': {
        let status = {
          state: this.OOPlayer.getState(),
          playhead: this.playhead,
          embed: this.OOPlayer.getEmbedCode(),
        };
        logger.info(LOG_PREFIX, 'MessageBus status:', status);
        this.mb.send(e.senderId, status);
        break;
      }

      case 'error':
        logger.error(LOG_PREFIX, 'MessageBus Sender Error:', e.data.message);
        break;
    }
  }

  /**
   * load handle the creation/update of the Ooayala player v4 using the embedcode and
   * params provied on the LOAD event at the mediaManager.
   *
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#load
   */
  load () {
    UIManager.hideSplashScreen();

    if (!this.OOPlayer) {
      this.OOPlayer = OO.Player.create('player', this.ec, this.params);
    } else if (this.OOPlayer.getEmbedCode() === this.ec) {
      // Replay asset if the same embed code loaded and the video has already been
      // completed.
      if (this.isCompleted) {
        this.isCompleted = false;
        this.OOPlayer.mb.publish(OO.EVENTS.REPLAY);
      }
    } else {
      this.OOPlayer.setEmbedCode(this.ec, this.params);
    }
  }

  /**
   * editTracksInfo is not implemented but it was keep it to follow the full
   * implementation of the player interface provied by Google Cast SDK.
   *
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#editTracksInfo
   */
  editTracksInfo () {
    //
  }

  /**
   * getCurrentTimeSec returns the current time of the asset.
   *
   * @returns {number} time in seconds
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#getCurrentTimeSec
   *
   * TODO: Shouldn't return null.
   */
  getCurrentTimeSec () {
    return this.OOPlayer ? this.OOPlayer.getPlayheadTime() : null;
  }

  /**
   * getDurationSec returns the duration of the asset.
   *
   * @returns {number} time in seconds
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#getDurationSec
   *
   * TODO: Shouldn't return null.
   */
  getDurationSec () {
    return this.OOPlayer ? this.OOPlayer.getDuration() : null;
  }

  /**
   * setClosedCaptions set the closed caption language for the asset. The value needs to
   * be one of the given by the asset info.
   *
   * @param {string} lang
   */
  setClosedCaptions (lang) {
    if (lang === '' || !lang) {
      lang = 'none';
    }

    logger.info(LOG_PREFIX, 'Closed captions new value:', lang);
    this.OOPlayer.setClosedCaptionsLanguage(lang);
  }

  /**
   * getState returns the actual state of the player. This method will convert from
   * Ooyala Player states to google cast states.
   *
   * @returns {cast.receiver.media.PlayerState}
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#getState
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media#.PlayerState
   */
  getState () {
    if (this.OOPlayer) {
      switch (this.OOPlayer.getState()) {
        case OO.STATE.LOADING:
        case OO.STATE.BUFFERING:
          this.state = cast.receiver.media.PlayerState.BUFFERING;
          break;

        case OO.STATE.PLAYING:
          this.state = cast.receiver.media.PlayerState.PLAYING;
          break;

        case OO.STATE.PAUSED:
          this.state = cast.receiver.media.PlayerState.PAUSED;
          break;

        case OO.STATE.READY:
          this.state = cast.receiver.media.PlayerState.IDLE;
          break;
      }
    }

    logger.info(LOG_PREFIX, 'State:', this.state);

    return this.state;
  }

  /**
   * play executes the play method on the Ooyala Player.
   *
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#play
   */
  play () {
    this.OOPlayer.play();
  }

  /**
   * pause executes the pause method on the Ooyala Player.
   *
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#pause
   */
  pause () {
    this.OOPlayer.pause();
  }

  /**
   * reset is not implemented but it was keep it to follow the full implementation of
   * the player interface provied by Google Cast SDK.
   *
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#reset
   */
  reset () {
    //
  }

  /**
   * seek sets the current position of the player on the asset from the beginning.
   *
   * @param {number} time
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#seek
   */
  seek (time) {
    this.OOPlayer.seek(time);
  }

  /**
   * setVolume sets the current volume of the Ooyala Player. The value must be between
   * 0 and 1, inclusive.
   *
   * @param {cast.receiver.media.Volume} volume
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#setVolume
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Volume
   */
  setVolume (volume) {
    this.OOPlayer.setVolume(volume.level);
  }

  /**
   * getVolume returns the current volume value of the Ooyala Player. The value is
   * converted to be an instance of cast.receiver.media.Volume.
   *
   * @returns {cast.receiver.media.Volume}
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#getVolume
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Volume
   */
  getVolume () {
    let volume = new cast.receiver.media.Volume();
    volume.level = this.OOPlayer.getVolume();
    volume.muted = false;

    logger.info(LOG_PREFIX, 'Volume:', volume);

    return volume;
  }

  /**
   * registerEndedCallback stores the given function as a callback to be executed once
   * the asset is played.
   *
   * @param {function} endedCallback
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#registerEndedCallback
   */
  registerEndedCallback (endedCallback) {
    this.endedCallback = endedCallback;
  }

  /**
   * registerErrorCallback stores the given function as a callback to be executed if the
   * Ooyala Player found an error.
   *
   * @param {function} errorCallback
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#registerErrorCallback
   */
  registerErrorCallback (errorCallback) {
    this.errorCallback = errorCallback;
  }

  /**
   * registerLoadCallback stores the given function as a callback to be executed once
   * the player is created.
   *
   * @param {function} loadCallback
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#registerLoadCallback
   */
  registerLoadCallback (loadCallback) {
    this.loadCallback = loadCallback;
  }

  /**
   * unregisterEndedCallback sets to null the reference for the endedCallback.
   *
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#unregisterEndedCallback
   */
  unregisterEndedCallback () {
    this.endedCallback = null;
  }

  /**
   * unregisterErrorCallback sets to null the reference for the errorCallback.
   *
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#unregisterErrorCallback
   */
  unregisterErrorCallback () {
    this.errorCallback = null;
  }

  /**
   * unregisterLoadCallback sets to null the reference for the loadCallback.
   *
   * @see https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Player#unregisterLoadCallback
   */
  unregisterLoadCallback () {
    this.loadCallback = null;
  }

  /**
   * onCreateHandlers receives the instance of the Ooyala Player and create event
   * listeners for the Ooyala Player events.
   *
   * @param {OO.Player} player
   */
  onCreateHandlers (player) {
    player.mb.subscribe(
      OO.EVENTS.PLAYBACK_READY,
      PLAYER_NAMESPACE,
      this.onPlaybackReady.bind(this)
    );

    player.mb.subscribe(
      OO.EVENTS.PLAYING,
      PLAYER_NAMESPACE,
      this.notifySenders.bind(this)
    );

    player.mb.subscribe(
      OO.EVENTS.PLAYHEAD_TIME_CHANGED,
      PLAYER_NAMESPACE,
      this.onPlayheadChanged.bind(this)
    );

    player.mb.subscribe(
      OO.EVENTS.PLAYED,
      PLAYER_NAMESPACE,
      this.onPlayed.bind(this)
    );

    player.mb.subscribe(
      OO.EVENTS.SEEK,
      PLAYER_NAMESPACE,
      this.notifySenders.bind(this)
    );

    player.mb.subscribe(
      OO.EVENTS.SEEKED,
      PLAYER_NAMESPACE,
      this.onSeeked.bind(this)
    );

    player.mb.subscribe(
      OO.EVENTS.PAUSED,
      PLAYER_NAMESPACE,
      this.notifySenders.bind(this)
    );

    player.mb.subscribe(
      OO.EVENTS.ERROR,
      PLAYER_NAMESPACE,
      this.onError.bind(this)
    );

    player.mb.subscribe(
      OO.EVENTS.API_ERROR,
      PLAYER_NAMESPACE,
      this.onApiError.bind(this)
    );

    // check if onCreate was defined and it's a function
    if (this.onCreate !== undefined && typeof this.onCreate === 'function') {
      this.onCreate(player);
    }
  }

  /**
   * notifySenders sends messages through the message bus to all the senders. It will
   * take all the arguments passed use them as part of the message body.
   */
  notifySenders () {
    let message = Object.assign({}, arguments);
    this.mb.broadcast(message);
  }

  /**
   * onSeeked handles the player event for OO.EVENTS.SEEKED and try to move the scrubber
   * bar to the seeked position if it's possible. After move the scrubber bar it will
   * notify to all the senders about the event.
   *
   * @param {string} event
   * @param {number} time
   */
  onSeeked (event, time) {
    // if the player is in PAUSE state then try to update the scrubber bar to the
    // actual time
    let skin = this.OOPlayer.modules.find(m => {
      return m.name === 'Html5Skin';
    });

    try {
      if (skin) {
        skin.instance.updateSeekingPlayhead(time);
      }
    } catch (e) {
      logger.warn(LOG_PREFIX, 'Skin instance error:', e);
    }

    this.notifySenders.apply(this, arguments);
  }

  /**
   * onPlaybackReady executes the loadCallback once the Ooyala Player it's ready to play
   * the asset.
   */
  onPlaybackReady () {
    if (this.loadCallback !== null) {
      this.loadCallback();
    }
  }

  /**
   * onPlayheadChanged stores the playback time status and notify to all senders.
   */
  onPlayheadChanged () {
    this.isCompleted = false;
    this.playhead = arguments;

    this.notifySenders.apply(this, arguments);
  }

  /**
   * onPlayed Shows the IDLE screen once the asset is played and sets the default
   * timeout. It will execute the endedCallback registered by the MediaManager and
   * notify to all senders.
   */
  onPlayed () {
    UIManager.setStatusCast(UIManager.status.READY);
    UIManager.showSplashScreen();

    this.isCompleted = true;
    if (this.endedCallback !== null) {
      this.endedCallback();
    }

    this.notifySenders.apply(this, arguments);

    logger.info(LOG_PREFIX, 'Played');
  }

  /**
   * onError receives the current error from the Ooyala Player and will logs the error
   * information.
   *
   * @param {string} e
   * @param {string} error
   */
  onError (e, error) {
    if (this.errorCallback !== null) {
      this.errorCallback();
    }

    logger.error(LOG_PREFIX, 'Error:', error);
  }

  /**
   * onApiError logs the error from Ooyala Player that are related with API requests.
   *
   * @param {string} e
   * @param {number} code
   * @param {string} message
   * @param {string} url
   */
  onApiError (e, code, message, url) {
    if (this.errorCallback !== null) {
      this.errorCallback();
    }

    logger.error(LOG_PREFIX, 'API Error:', code, message, url);
  }
}

export default CastPlayer;
