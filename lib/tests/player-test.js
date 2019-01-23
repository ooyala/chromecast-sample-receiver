import Player from '../src/app/player';
import { getPageLevelParams } from './player-test-helpers';

// import * as pageParamHelperMock from '../src/app/helpers/createPageLevelParameters';
jest.mock('../src/app/helpers/createPageLevelParameters');

// import receiverManager from '../src/app/receiverManager';
jest.mock('../src/app/receiverManager', () => ({
    getCastMessageBus: () => ({
        onMessage: jest.fn()
    })
}));

const GOOGLE_CAST_PREFIX = 'urn:x-cast:';
const CAST_NAMESPACE = GOOGLE_CAST_PREFIX + 'ooyala';

describe('Player', () => {

    let player;

    beforeEach(() => {
        const pageLevelParams = getPageLevelParams();
        player = new Player(CAST_NAMESPACE, pageLevelParams);
    });

    it('should toggle closed captions', () => {                
        
        // inject OO.Player into CastPlayer
        player.OOPlayer = {
            toggleClosedCaptions: jest.fn()
        };
        
        player.toggleClosedCaptions();
        expect(player.OOPlayer.toggleClosedCaptions).toHaveBeenCalledTimes(1);
    });
});