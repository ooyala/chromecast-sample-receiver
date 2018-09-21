/* global cast */

/**
 * Receiver Manager module. This module returns an instance of cast.receiver.CastReceiverManager
 * @module receiverManager
 * @return {cast.receiver.CastReceiverManager} instance
 */
import * as logger from 'loglevel';
import UIManager from './uiManager';
import Timer from './idleTimer';

const LOG_PREFIX = 'ReceiverManager:';

const castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

castReceiverManager.onSenderConnected = onSenderConnected;
castReceiverManager.onSenderDisconnected = onSenderDisconnected;
castReceiverManager.onReady = onReady;

/**
 * onReady method sets the idle screen and timeout
 */
function onReady () {
  UIManager.setStatusCast(UIManager.status.READY);
  Timer.setIdle(Timer.TIMEOUT.IDLE);
}
/**
 * onSenderConnected method logs the connected senders on the application
 */
function onSenderConnected () {
  const senders = castReceiverManager.getSenders();
  logger.info(LOG_PREFIX, 'Connected Senders:', senders);
}
/**
 * onSenderDisconnected method checks if there is at least one sender connected to the app
 * otherwise it will call the stop method at the CastReceiverManager instance
 * @param {object} event cast.receiver.CastReceiverManager.SenderDisconnectedEvent
 */
function onSenderDisconnected (event) {
  const senders = castReceiverManager.getSenders();
  logger.log(LOG_PREFIX, 'Sender disconnected:', event);
  if (
    senders.length === 0 &&
    event.reason === cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER
  ) {
    castReceiverManager.stop();
  }
}

export default castReceiverManager;
