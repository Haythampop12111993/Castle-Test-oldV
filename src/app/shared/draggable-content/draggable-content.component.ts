import { Component, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "draggable-content",
  templateUrl: "./draggable-content.component.html",
  styleUrls: ["./draggable-content.component.css"],
})
export class DraggableContentComponent implements OnInit {
  isDraging = false;

  @ViewChild("drag_container") drag_container;

  constructor() {}

  ngOnInit(): void {}

  onMouseDown() {
    this.isDraging = true;
  }

  onMouseUp() {
    this.drag_container.nativeElement.classList.remove("dragging");
    this.isDraging = false;
  }

  onDrag(e) {
    if (!this.isDraging) return;
    e.preventDefault();
    this.drag_container.nativeElement.classList.add("dragging");
    this.drag_container.nativeElement.scrollLeft -= e.movementX;
  }
}
