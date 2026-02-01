import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable()
export class GlobalNotificationsService {
  // lastNotifications: any[] = [];
  // lastNotifications$ = new BehaviorSubject<any[]>([]);

  // unReaded = 0;
  // unReaded$ = new BehaviorSubject<number>(0);

  newNotification = new BehaviorSubject<any>(null);

  baseUrl: string = environment.api_base_url;
  constructor(private http: HttpClient) {}

  // getters
  // getNotifications(): any[] {
  //   return this.lastNotifications;
  // }

  // getLength(): number {
  //   return this.lastNotifications.length;
  // }

  // actions
  addNotification(notification: any) {
    this.newNotification.next(notification);
    // this.onReadChanged(1);
  }

  // onReadChanged(n: number, reset = false) {
  //   if (reset) {
  //     this.unReaded = n;
  //   } else {
  //     this.unReaded += n;
  //   }
  //   this.unReaded$.next(this.unReaded);
  // }
  // fetchers
  fetchNotifications() {
    return this.http.get(`${this.baseUrl}notifications`);
  }

  // request actions
  // readNotification(notificationId) {
  //   return this.http.get(`members/notifications/${notificationId}`);
  // }

  // readAll() {
  //   return this.http.get(`members/notifications/read-all`);
  // }
}
