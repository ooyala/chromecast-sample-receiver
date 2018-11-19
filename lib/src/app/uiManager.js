/**
 * uiManager module. This module handles the IDLE screen at the chromecast device
 *
 * @module uiManager
 */
const splashScreen = document.querySelector('#splash-screen');
const statusElement = document.querySelector('#status-cast');

// status const that holds the message related with a status
const status = {
  LOADING: 'Loading environment',
  READY: 'Ready to cast',
};

/**
 * showSplashScreen shows the splash screen
 *
 */
function showSplashScreen () {
  splashScreen.classList.remove('hidden');
}

/**
 * hideSplashScreen hide the splash screen
 *
 */
function hideSplashScreen () {
  splashScreen.classList.add('hidden');
}

/**
 * setStatusCast inserts a message on the splash screen
 *
 * @param {string} message Message to be shown
 */
function setStatusCast (message) {
  statusElement.textContent = message;
}

export default {
  showSplashScreen: showSplashScreen,
  hideSplashScreen: hideSplashScreen,
  setStatusCast: setStatusCast,
  status: status,
};
