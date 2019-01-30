import defaultSkin from '../skin';
import defaultsDeep from 'lodash.defaultsdeep';
import get from 'lodash.get';

/**
 * Having default skin config with unlimited depth and custom pageLevelParameters with onCreateHandlers
 * performs deep merge (vanilla JS is unable to do this in one line)
 * @param {object} pageLevelParameters custom config
 * @param {function} onCreateHandlers function to be called when player created
 * @returns {object} result of merge
 */
// caution: impure, mutates its first argument pageLevelParameters
export function createPageLevelParameters (pageLevelParameters, onCreateHandlers) {
  // check if pageLevelSkin was provided from inline parameters and
  // merge it with default skin
  const pageLevelSkin = get(pageLevelParameters, 'skin.inline', {});

  // save custom onCreate to CastPlayer.onCreate field
  const pageLevelParametersOverrides = {
    ...pageLevelParameters,
    ...{
    // merge default skin with page level skin overriding default with custom parameters
      skin: {
        inline: defaultsDeep(pageLevelSkin, defaultSkin),
      },
      // chromecast should start with autoplay by default
      // if user doesn't explicitly specify otherwise
      autoplay: pageLevelParameters.autoplay || true,
      // we also need to make sure we don't lose
      // and onCreateHandlers and customer provided handlers from onCreate,
      // so we need to merge handlers together
      onCreate: onCreateHandlers,
    },
    chromecast: {
      isReceiver: true
    }
  };

  return pageLevelParametersOverrides;
}
