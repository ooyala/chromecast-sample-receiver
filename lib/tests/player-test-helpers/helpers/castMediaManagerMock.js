export class CastMediaManagerMock {
  constructor(castPlayer) {

    this.onLoad = jest.fn(() => {
      castPlayer.load();
    });
    this.onPause = jest.fn();
    this.onPlay = jest.fn();

  }
}