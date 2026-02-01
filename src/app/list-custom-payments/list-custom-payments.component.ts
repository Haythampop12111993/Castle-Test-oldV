import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { LeadsService } from '../services/lead-service/lead-service.service';
import { PaymentService } from '../services/payment/payment.service';
import { ReservationService } from '../services/reservation-service/reservation.service';
import { ErrorHandlerService } from '../services/shared/error-handler.service';

@Component({
  selector: 'app-list-custom-payments',
  templateUrl: './list-custom-payments.component.html',
  styleUrls: ['./list-custom-payments.component.css']
})
export class ListCustomPaymentsComponent implements OnInit {

  payments;

  raw_payments: any;

  pageTest: any = 1;

  pagination: any[];

  last_page_url: any;

  current_page: any;

  userInfo;

  constructor(
    private paymentService: PaymentService, 
    private errorHandlerService: ErrorHandlerService,
    private leadsService: LeadsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private router: Router,
    private reservationService: ReservationService) { 
      this.userInfo = JSON.parse(window.localStorage.getItem("userProfile"));
  }

  ngOnInit() {
    this.getCustomPayments();
  }

  getCustomPayments() {
    this.paymentService.getCustomPayments().subscribe(
      (data: any) => {
        this.pagination = [];
        this.last_page_url = data.last_page_url;
        this.current_page = 1;
        this.payments = data.data;
        this.raw_payments = data;
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }

  pageChange(event) {
    console.log(event);
    // this.paginate(event);
    console.log(this.last_page_url);
    const arr = this.last_page_url.split('?');
    const selectedUrl = `${arr[0]}?page=${event}`;
    // if (this.filterActive) {
    //   this.infiniteWithFilter(selectedUrl, event)
    // } else {
    //   this.infinite(selectedUrl, event);
    // }
    this.infinite(selectedUrl, event);
  }

  infinite(url, event) {
    this.leadsService.infinit(url).subscribe(
      (data: any) => {
        // this.totalRec = data.total;
        this.payments = data.data;
        this.last_page_url = data.last_page_url;
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }

  edit(id) {
    // this.router.navigate(['/pages/settings/teams/add/', id]);
    this.router.navigate(['/pages/custom-payment-generator/'], {
      queryParams: {
        mode: 'edit',
        id: id
      }
    });
  }

  view(id) {
    this.router.navigate(['/pages/custom-payment-generator/'], {
      queryParams: {
        mode: 'view',
        id: id
      }
    });
  }

  getPdf(id) {
    console.log(id);
    let url = `${environment.api_raw_base_url}payments/generate_custom_payment_plan_file/${id}?generated_view=pdf`;
    window.open(url);
  }

  getExcel(id) {
    console.log(id);
    let url = `${environment.api_raw_base_url}payments/generate_custom_payment_plan_file/${id}?generated_view=excel`;
    window.open(url);
  }

  resrveUnit(unitId, unitStatus, payment) {
    if (this.userInfo.id == unitId && unitStatus == "Temp Blocked") {
      this.router.navigate(["pages/reservations/add/", unitId]);
    } else {
      swal({
        title: "Are you sure?",
        text: "You will reserve the unit!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reserve it!",
        cancelButtonText: "No, keep it",
      }).then((result) => {
        if (result.value) {
          this.slimLoadingBarService.start();
          this.reservationService.blockUnitAtReservation(unitId).subscribe(
            (data) => {
              console.log(data);
              this.router.navigate(["pages/reservations/add/", unitId], {
                queryParams: {
                  finish_type_id: payment.finishing_type_id,
                  project_id: payment.project_id,
                  payment_plan_id: payment.id
                }
              });
              this.slimLoadingBarService.complete();
            },
            (err) => {
              this.errorHandlerService.handleErorr(err);
              this.slimLoadingBarService.complete();
            }
          );
        } else if (result.dismiss) {
          swal("Cancelled", "", "error");
        }
      });
    }
  }

}
