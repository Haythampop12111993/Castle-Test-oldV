import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';
import { LeadsService } from '../../services/lead-service/lead-service.service';
import { ReservationService } from '../../services/reservation-service/reservation.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {

  contracts: any;
  pageTest: any = 1;
  last_page_url: any;
  lg: any = 'lg';

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private reservationService: ReservationService,
    private leadsService: LeadsService,
    private router: Router
    ) { }

  ngOnInit() {
    this.getContracts();
  }

  editContract(contract_id) {
    this.router.navigate(['/pages/settings/add-contract'], {
      queryParams: { 
        contract_id: contract_id
      }
    });
  }

  getContracts() {
    this.slimLoadingBarService.start();
    this.reservationService.getAllContractsTempaltes()
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        this.contracts = res;
        this.last_page_url = res.last_page_url;
      }, err => {
        this.slimLoadingBarService.reset();
      });
  }

  pageChange(event) {
    console.log(event);
    console.log(this.last_page_url);
    let arr = this.last_page_url.split('?');
    let selectedUrl = `${arr[0]}?page=${event}`;
    this.infinite(selectedUrl, event);
  }

  infinite(url, event) {
    this.leadsService.infinit(url).subscribe(
      (res: any) => {
        this.contracts = res;
        this.last_page_url = res.last_page_url;
        console.log(this.contracts);
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }

  deleteContract(index, id) {
    this.slimLoadingBarService.start();
    this.reservationService.deleteContract(id)
      .subscribe((res: any) => {
        swal('success', 'Deleted contact succesfully', 'success');
        this.contracts.data.splice(index, 1);
      }, err => {
        this.errorHandlerService.handleErorr(err);
      });
  }

  getContractParents(contract) {
    return '';
  }
}