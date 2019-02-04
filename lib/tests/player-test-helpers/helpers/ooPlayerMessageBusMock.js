import EventEmitter from 'events';

export class OOPlayerMessageBusMock {

  constructor() {
      this.emitter = new EventEmitter();
  }

  subscribe(event, subscriber, callback) {
      this.emitter.on(event, callback);
  }

  publish(event, ...args) {
      const callbackArgs = [event, ...args];
      this.emitter.emit(event, ...callbackArgs);
  }

};