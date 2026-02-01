import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { UserServiceService } from "../../services/user-service/user-service.service";

@Component({
  selector: "app-add-broker-activity-modal",
  templateUrl: "./add-broker-activity-modal.component.html",
  styleUrls: ["./add-broker-activity-modal.component.css"],
})
export class AddBrokerActivityModalComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;

  broker_id = null;
  formData;

  loading = false;

  constructor(private userService: UserServiceService) {}

  ngOnInit() {}

  public open(broker_id) {
    this.broker_id = broker_id;

    this.formData = {
      details: "",
      make_reminder: true,
      datetime: "",
    };

    this.modalRef.open();
  }

  save() {
    if (!this.formData.make_reminder) {
      delete this.formData.datetime;
    }
    this.loading = true;
    this.userService
      .addBrokerActiviry(this.broker_id, this.formData)
      .subscribe((res) => {
        this.onSave.emit();
        this.modalRef.close();
      })
      .add(() => {
        this.loading = false;
      });
  }
}
