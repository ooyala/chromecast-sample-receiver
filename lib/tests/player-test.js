import Player from '../src/app/player';
import { getPageLevelParams, CHROMECAST_ACTION, CHROMECAST_EVENT } from './player-test-helpers';

jest.mock('loglevel');
// import * as pageParamHelperMock from '../src/app/helpers/createPageLevelParameters';
jest.mock('../src/app/helpers/createPageLevelParameters');
jest.mock('../src/app/uiManager');

import receiverManager from '../src/app/receiverManager';
jest.mock('../src/app/receiverManager', () => ({
    
    castMessageBus: {
        onMessage: () => {},
        send: jest.fn(),
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
    let pageLevelParams;

    beforeEach(() => {
        pageLevelParams = getPageLevelParams();
        player = new Player(CAST_NAMESPACE, pageLevelParams);
        
        OOPlayerMock = {
            toggleClosedCaptions: jest.fn(),
            setClosedCaptionsLanguage: jest.fn(),
            getState: jest.fn(),
            getEmbedCode: jest.fn(),
            mb: {
                publish: jest.fn()
            }
        };
        OO.Player.create = () => OOPlayerMock;
        
        player.load();
    });

    describe('Player creation', () => {
        
        it('should throw if namespace is invalid', () => {
            expect(() => new Player('invalid_namespace', {})).toThrow(/Invalid namespace/);
        });

        it('should be initialized properly', () => {
            expect(player).toEqual(expect.objectContaining({
                state: cast.receiver.media.PlayerState.IDLE,
                onCreate: pageLevelParams.onCreate,
                mb: receiverManager.getCastMessageBus()
            }));
        });
    });

    describe('Player messages from Sender', () => {

        it('should toggle closed captions on toggleClosedCaptions event from Sender', () => {    
            const fromSender = {
                data: {
                    action: CHROMECAST_ACTION.TOGGLE_CLOSED_CAPTIONS,
                }
            };            
            receiverManager.getCastMessageBus().onMessage(fromSender);
            expect(OOPlayerMock.toggleClosedCaptions).toHaveBeenCalledTimes(1);
        });
    
        it('should set CC language on setCCLanguage event from Sender', () => {
            const fromSender = {
                data: {
                    action: CHROMECAST_ACTION.SET_CC_LANGUAGE,
                    data: 'es',
                }
            };
            receiverManager.getCastMessageBus().onMessage(fromSender);
            expect(OOPlayerMock.setClosedCaptionsLanguage).toHaveBeenCalledWith('es');
        });
    
        it('should set CC language to none on setCCLanguage event from Sender', () => {
            const fromSender = {
                data: {
                    action: CHROMECAST_ACTION.SET_CC_LANGUAGE,
                }
            };
            receiverManager.getCastMessageBus().onMessage(fromSender);
            expect(OOPlayerMock.setClosedCaptionsLanguage).toHaveBeenCalledWith('none');
        });
    
        it('should send status back to the Sender on receiverStatusLoss event', () => {
            const senderId = 'id';
            const fromSender = {
                senderId,
                data: {
                    action: CHROMECAST_ACTION.RECEIVER_STATUS_LOSS,
                }
            };
            const embedCode = 'embedCode';
            OOPlayerMock.getState.mockReturnValue(OO.STATE.READY);
            OOPlayerMock.getEmbedCode.mockReturnValue(embedCode);
            
            const messageBus = receiverManager.getCastMessageBus();
            messageBus.onMessage(fromSender);
            expect(OOPlayerMock.getState).toHaveBeenCalled();
            expect(OOPlayerMock.getEmbedCode).toHaveBeenCalled();
            expect(messageBus.send).toHaveBeenCalledWith(senderId, {
                action: CHROMECAST_EVENT.STATUS_UPDATE,
                state: OO.STATE.READY,
                playhead: expect.any(Object),
                embed: embedCode,
                isCompleted: false,
            });
        });
    });

});