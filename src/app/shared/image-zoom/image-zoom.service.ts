import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
declare const firebase: any;

@Injectable()
export class ImageZoomService {
  status$ = new Subject();

  constructor() {}

  open(img: string) {
    this.status$.next({
      status: "open",
      img: img,
    });
  }
}
