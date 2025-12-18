import EventEmitter from "events";

declare global {
  // eslint-disable-next-line no-var
  var notificationSubject: NotificationSubject | undefined;
}

class NotificationSubject extends EventEmitter {}

export const notificationSubject = globalThis.notificationSubject ??
  (globalThis.notificationSubject = new NotificationSubject());