import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { UserServiceService } from "../services/user-service/user-service.service";
@Component({
  selector: "app-broker-view",
  templateUrl: "./broker-view.component.html",
  styleUrls: ["./broker-view.component.css"],
})
export class BrokerViewComponent implements OnInit {
  userInfo: any = JSON.parse(window.localStorage.getItem("userProfile"));

  broker_id;
  BrokerDetails: any;

  loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserServiceService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.broker_id = +params.id;
      if (this.broker_id) {
        this.getBroker();
      } else {
        this.router.navigate(["/", "pages", "brokers"]);
      }
    });
  }

  getBroker() {
    this.loading = true;
    this.userService.getBrokerById(this.broker_id).subscribe(
      (data) => {
        this.BrokerDetails = data;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => (this.loading = false)
    );
  }
}
