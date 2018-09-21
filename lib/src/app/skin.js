/**
 * skin module. This module returns an object that contains the inline modifications
 * on the Ooyala skin.
 * This skin object overrides and hide the non used elements by a player that will be used on
 * a Chromecast device
 *
 * @module skin
 * @return {object} skin
 */

const defaultSkin = {
  startScreen: {
    showPlayButton: true,
    showTitle: true,
    showDescription: true,
  },
  pauseScreen: {
    showPauseIcon: true,
    showTitle: true,
    showDescription: true,
  },
  endScreen: {
    screenToShowOnEnd: 'default',
    showReplayButton: false,
    showTitle: true,
    showDescription: true,
  },
  buttons: {
    desktopContent: [
      {
        name: 'playPause',
        location: 'controlBar',
        whenDoesNotFit: 'keep',
        minWidth: 45,
      },
      {
        name: 'live',
        location: 'controlBar',
        whenDoesNotFit: 'keep',
        minWidth: 45,
      },
      {
        name: 'timeDuration',
        location: 'controlBar',
        whenDoesNotFit: 'drop',
        minWidth: 145,
      },
    ],
  },
};

export default defaultSkin;
