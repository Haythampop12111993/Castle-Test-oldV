import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-view-qualification-modal",
  templateUrl: "./view-qualification-modal.component.html",
  styleUrls: ["./view-qualification-modal.component.css"],
})
export class ViewQualificationModalComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;

  lead_data;

  constructor() {}
  ngOnInit() {}
  public open(lead_data) {
    if (lead_data) {
      this.lead_data = lead_data;
      this.modalRef.open();
    }
  }
}
