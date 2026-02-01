import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import "rxjs/Rx";
import { GlobalNotificationsService } from "../global-notifications/global-notifications.service";
import { Router } from "@angular/router";

declare const firebase: any;

@Injectable()
export class NotificationsService {
  token = null;

  constructor(
    private globalNotification: GlobalNotificationsService,
    private router: Router
  ) {}

  initPush() {
    return new Promise((resolve, reject) => {
      if (this.token) {
        return resolve(this.token);
      } else {
        return this.requestToken()
          .then((token) => {
            this.token = token;
            this.listen();
            resolve(token);
          })
          .catch((e) => {
            console.log(e);
            resolve("");
          });
      }
    });
  }

  async requestToken() {
    const serviceWorkerRegistration = await navigator.serviceWorker.register(
      `${environment.baseHREF}firebase-messaging-sw.js`
    );
    navigator.serviceWorker.onmessage = ({ data }) => {
      console.log(data);
      const { type, notification } = data;
      switch (type) {
        case "NEW-CUSTOM-NOTIFICATION": {
          this.handelNotification(false, notification);
          break;
        }
      }
    };
    const messaging = firebase.messaging();
    return messaging.getToken({
      serviceWorkerRegistration: serviceWorkerRegistration,
      vapidKey: environment.firebase.vapidKey,
    });
  }

  listen() {
    const messaging = firebase.messaging();
    messaging.onMessage(this.handelNotification.bind(this, true));
  }

  handelNotification(emitNotification, payload) {
    console.log("foreground message", payload);
    if (emitNotification) {
      this.createNotification(payload.data);
    }
    this.globalNotification.addNotification(payload.data as unknown as any);
  }

  createNotification(not) {
    let notification: Notification;
    if (!("Notification" in window)) {
      return;
    } else if (Notification.permission === "granted") {
      notification = this.emitNotification(
        not.notification.title,
        not.notification.body
      );
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          notification = this.emitNotification(
            not.notification.title,
            not.notification.body
          );
        }
      });
    }

    // click action
    if (notification) {
      notification.onclick = (_) => {
        let url = "/notifications";

        this.router.navigate([url]);
      };
    }
  }

  emitNotification(title, body) {
    return new Notification(title, { body });
  }
}
