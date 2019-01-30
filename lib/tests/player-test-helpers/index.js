export const getPageLevelParams = () => ({
    pcode: "c0cTkxOqALQviQIGAHWY5hP0q9gU",
    playerBrandingId: "e48c9b51282d406f957c666149763424",
      skin: {
          inline: {
              pauseScreen: {
                  showDescription: false
              }
          }
      },
      onCreate: () => {}
  });

  export const CHROMECAST_ACTION = {
    RECEIVER_STATUS_LOSS: 'receiverStatusLoss',
    TOGGLE_CLOSED_CAPTIONS: 'toggleClosedCaptions',
    SET_CC_LANGUAGE: 'setCCLanguage',
  };

  export const CHROMECAST_EVENT = {
    PLAYING: 'playing',
    PLAYED: 'played',
    PAUSED: 'paused',
    PLAYHEAD_TIME_CHANGED: 'playheadTimeChanged',
    SEEK: 'seek',
    STATUS_UPDATE: 'statusUpdate',
  };