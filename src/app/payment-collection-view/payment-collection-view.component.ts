import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { ReservationService } from "../services/reservation-service/reservation.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";

import { LeadsService } from "../services/lead-service/lead-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { ProjectsService } from "../services/projects/projects.service";
import { UserServiceService } from "../services/user-service/user-service.service";

@Component({
  selector: "app-payment-collection-view",
  templateUrl: "./payment-collection-view.component.html",
  styleUrls: ["./payment-collection-view.component.css"],
})
export class PaymentCollectionViewComponent implements OnInit {
  id;

  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));

  payment_collection: any;

  partially_methods = [
    "Visa",
    "Cash",
    "Transfer",
    "Cheque",
    "Cash instead of cheque",
  ];

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private reservationService: ReservationService,
    private errorHandlerService: ErrorHandlerService,
    private projectsService: ProjectsService,
    private leadsService: LeadsService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserServiceService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(({ id }) => {
      if (!id) {
        this.router.navigate([".."]);
      }
      this.id = id;
      this.getPaymentCollection();
    });
  }

  getPaymentCollection() {
    this.slimLoadingBarService.start();
    this.reservationService
      .getSinglePaymentCollection(this.id)
      .subscribe(
        (res: any) => {
          this.payment_collection = res;

          this.payment_collection.collect_types = Array.from(
            new Set(this.payment_collection.receipts.map((r) => r.type_string))
          ).join(", ");
        },
        (err) => {
          this.router.navigate([".."]);
        }
      )
      .add(() => {
        this.slimLoadingBarService.complete();
      });
  }
}
