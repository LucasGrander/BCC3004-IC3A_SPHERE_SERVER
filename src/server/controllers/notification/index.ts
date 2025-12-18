import * as readNotification from "./readNotification";
import * as getAllFNotifications from "./getAllNotifications";

export const NotificationController = {
    ...readNotification,
    ...getAllFNotifications,

};