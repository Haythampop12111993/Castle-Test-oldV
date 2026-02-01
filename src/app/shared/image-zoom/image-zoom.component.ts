import { ImageZoomService } from "./image-zoom.service";
import { Component, Input, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "image-zoom",
  templateUrl: "./image-zoom.component.html",
  styleUrls: ["./image-zoom.component.css"],
})
export class ImageZoomComponent implements OnInit {
  @ViewChild("image") image: any;
  @ViewChild("magnifierEl") magnifierEl: any;
  //#region Definitions
  status = "close";
  img: string;
  constructor(private imageZoomService: ImageZoomService) {
    imageZoomService.status$.subscribe((val: any) => {
      this.status = val.status;
      if (this.status === "open") {
        this.img = val.img;
      }
    });
  }

  ngOnInit(): void {}

  // zome

  magnifier = {
    view: false,
    width: 250,
    height: 250,
    top: "",
    left: "",
    backgroundPosition: "",
  };

  bgSize;

  scale = 2;

  onZoom(e: any) {
    e.preventDefault();
    this.magnifier.view = true;
    this.bgSize =
      this.image.nativeElement.width * this.scale +
      "px " +
      this.image.nativeElement.height * this.scale +
      "px";

    let pos = this.getCursorPos(e);

    let x = pos.x;
    let y = pos.y;

    let w = this.magnifier.width / 2;
    let h = this.magnifier.height / 2;
    if (x > this.image.nativeElement.width - w / this.scale) {
      x = this.image.nativeElement.width - w / this.scale;
    }
    if (x < w / this.scale) {
      x = w / this.scale;
    }
    if (y > this.image.nativeElement.height - h / this.scale) {
      y = this.image.nativeElement.height - h / this.scale;
    }
    if (y < h / this.scale) {
      y = h / this.scale;
    }
    let left = x - w;
    let top = y - h;

    if (left < 0) {
      left = 0;
    } else if (left > this.image.nativeElement.width - this.magnifier.width) {
      left = this.image.nativeElement.width - this.magnifier.width;
    }
    if (top < 0) {
      top = 0;
    } else if (top > this.image.nativeElement.height - this.magnifier.height) {
      top = this.image.nativeElement.height - this.magnifier.height;
    }

    this.magnifier.left = left + "px";
    this.magnifier.top = top + "px";

    this.magnifier.backgroundPosition =
      "-" + (x * this.scale - w + 3) + "px -" + (y * this.scale - h + 3) + "px";
  }

  offZoom(e: any) {
    e.preventDefault();
    this.magnifier.view = false;
  }

  onScroll(e: any) {
    e.preventDefault();
    let delta = -e.deltaY;
    if (delta < 0 && this.scale === 1) {
      return;
    }

    this.scale += delta / 1000;
    if (this.scale < 1) {
      this.scale = 1;
    }

    this.onZoom(e);
  }

  getCursorPos(e: any) {
    var a,
      x = 0,
      y = 0;
    e = e || window.event;
    a = this.image.nativeElement.getBoundingClientRect();
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  }
}
