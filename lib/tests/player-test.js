import Player from '../src/app/player';
import { getPageLevelParams } from './player-test-helpers';

// import * as pageParamHelperMock from '../src/app/helpers/createPageLevelParameters';
jest.mock('../src/app/helpers/createPageLevelParameters');
jest.mock('../src/app/uiManager');

import receiverManager from '../src/app/receiverManager';
jest.mock('../src/app/receiverManager', () => ({
    
    castMessageBus: {
        onMessage: () => {}
    },

    getCastMessageBus() {
        return this.castMessageBus;
    }

}));

const GOOGLE_CAST_PREFIX = 'urn:x-cast:';
const CAST_NAMESPACE = GOOGLE_CAST_PREFIX + 'ooyala';

describe('Player', () => {

    let player;
    let OOPlayerMock;

    beforeEach(() => {
        const pageLevelParams = getPageLevelParams();
        player = new Player(CAST_NAMESPACE, pageLevelParams);
        
        OOPlayerMock = {
            toggleClosedCaptions: jest.fn()
        };
        OO.Player.create = () => OOPlayerMock;
        
        player.load();
    });

    it('should toggle closed captions', () => {    
        const fromSender = {
            data: {
                action: 'toggleClosedCaptions'
            }
        };            
        receiverManager.getCastMessageBus().onMessage(fromSender);
        expect(OOPlayerMock.toggleClosedCaptions).toHaveBeenCalledTimes(1);
    });
});