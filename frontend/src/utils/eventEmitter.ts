/* eslint-disable @typescript-eslint/no-explicit-any */
interface Events {
    [key: string]: Function[];
}

export default {
  events: {} as Events,

  dispatch(event: string, data?: any): void {
    if (event in this.events) {
      this.events[event].forEach((callback: Function) => callback(data));
    }
  },

  subscribe(event: string, callback: any): void {
    if (!(event in this.events)) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },

  unsubscribe(event: string): void {
    delete this.events[event];
  },
};
