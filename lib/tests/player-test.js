import Player from '../src/app/player';
import MediaManager from '../src/app/mediaManager';
import { 
    getPageLevelParams, 
    CHROMECAST_ACTION, 
    CHROMECAST_EVENT, 
    OOPlayerMessageBusMock, 
    CastMediaManagerMock 
} from './player-test-helpers';

jest.mock('loglevel');
jest.mock('../src/app/idleTimer');
jest.mock('../src/app/uiManager');

import receiverManager from '../src/app/receiverManager';
jest.mock('../src/app/receiverManager', () => ({
    
    castMessageBus: {
        onMessage: () => {},
        send: jest.fn(),
        broadcast: jest.fn(),
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
            setEmbedCode: jest.fn(),
            getEmbedCode: jest.fn(),
            mb: new OOPlayerMessageBusMock(),
        };

        OO.Player.create = (container, asset, parameters) => {
            if (parameters && parameters.onCreate) {
                parameters.onCreate(OOPlayerMock);
            }
            return OOPlayerMock;
        };
        
        player.load();
    });

    describe('Player creation', () => {
        
        it('should throw if namespace is invalid', () => {
            expect(() => new Player('invalid_namespace', {})).toThrow(/Invalid namespace/);
        });

        it('should initialize player properties correctly', () => {
            const { onCreate, skin, ...restPageLevelParams } = pageLevelParams;
            
            expect(player).toEqual(expect.objectContaining({
                state: cast.receiver.media.PlayerState.IDLE,
                onCreate,
                mb: receiverManager.getCastMessageBus(),
            }));
            
            expect(player.params).toEqual(expect.objectContaining({
                ...restPageLevelParams
            }));
        });

        it('should call onCreate callback provided by pageLevelParams after its own onCreate', () => {
            expect(pageLevelParams.onCreate).toHaveBeenCalledTimes(1);
        });
    });

    describe('Player on requests from Sender', () => {
        
        let mediaManager;

        beforeEach(() => {
            cast.receiver.MediaManager = CastMediaManagerMock;
            mediaManager = MediaManager.createMediaManagerFor(player);
        });
        
        it('should setAsset on Load request', () => {
            const customData = {
                ec: 'embedCode',
                params: {}
            };
            const requestFromSender = {
                data: {
                    media: { customData }
                }
            };
            OOPlayerMock.getState.mockReturnValue(OO.STATE.READY);

            mediaManager.onLoad(requestFromSender);

            expect(player.OOPlayer.setEmbedCode).toHaveBeenCalledWith(customData.ec, expect.any(Object));
            expect(player.mb.broadcast).toHaveBeenCalledWith({ '0': OO.STATE.READY });
        });

        it('should notifySenders on Pause request', () => {
            const requestFromSender = {};
            OOPlayerMock.getState.mockReturnValue(OO.STATE.PAUSED);

            mediaManager.onPause(requestFromSender);
            expect(player.mb.broadcast).toHaveBeenCalledWith({ '0': OO.STATE.PAUSED });
        });
    });

    describe('Player on custom messages from Sender', () => {

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

    describe('Player on events from OOPlayer', () => {
        
        it('should invoke onLoadCallback on PLAYBACK_READY event', () => {
            // by MediaManager
            const callback = jest.fn();
            player.registerLoadCallback(callback);

            OOPlayerMock.mb.publish(OO.EVENTS.PLAYBACK_READY);
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should notify Senders on PLAYING event', () => {
            OOPlayerMock.mb.publish(OO.EVENTS.PLAYING);
            expect(player.mb.broadcast).toHaveBeenCalledWith({ '0': OO.EVENTS.PLAYING });
        });

        it('should set playheadTime on PLAYHEAD_TIME_CHANGED event', () => {
            const playheadEventData = [OO.EVENTS.PLAYHEAD_TIME_CHANGED, 17.1, 180.2, 21.2, { start: 0, end: 180.2 }, OO.VIDEO.MAIN];
            OOPlayerMock.mb.publish(...playheadEventData);
            
            const arrayLikePlayheadObject = { ...playheadEventData };
            expect(player.isCompleted).toBeFalsy();
            expect(player.playhead).toEqual(expect.objectContaining(arrayLikePlayheadObject));
            expect(player.mb.broadcast).toHaveBeenCalledWith(arrayLikePlayheadObject);
        });

        it('should update state and call onEnded function on PLAYED event', () => {
            // by MediaManager
            const callback = jest.fn();
            player.registerEndedCallback(callback);

            OOPlayerMock.mb.publish(OO.EVENTS.PLAYED);

            expect(player.onPlayed).toBeTruthy();
            expect(player.mb.broadcast).toHaveBeenCalledWith({ '0': OO.EVENTS.PLAYED });
            expect(callback).toHaveBeenCalled();
        });

        it('should update Skin playhead and notifySenders on SEEKED event', () => {
            const time = 1.28;
            const html5SkinModule = {
                name: 'Html5Skin',
                instance: {
                    updateSeekingPlayhead: jest.fn(),
                }
            };
            OOPlayerMock.modules = [html5SkinModule];
            OOPlayerMock.mb.publish(OO.EVENTS.SEEKED, time);

            expect(html5SkinModule.instance.updateSeekingPlayhead).toHaveBeenCalledWith(time);
            expect(player.mb.broadcast).toHaveBeenCalledWith({ '0': OO.EVENTS.SEEKED, '1': time });
        });

        it('should notify Senders on PAUSED event', () => {
            OOPlayerMock.mb.publish(OO.EVENTS.PAUSED);
            expect(player.mb.broadcast).toHaveBeenCalled();
        });
    })

});