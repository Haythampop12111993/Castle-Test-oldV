import { Component, OnInit } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';
import { ProjectsService } from '../services/projects/projects.service';

@Component({
  selector: 'app-bank-cheque-listing',
  templateUrl: './bank-cheque-listing.component.html',
  styleUrls: ['./bank-cheque-listing.component.css']
})
export class BankChequeListingComponent implements OnInit {

  banks: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.getBanksLists();
  }

  getBanksLists() {
    this.slimLoadingBarService.start();
    this.projectsService.getBankCheques()
      .subscribe((res: any) => {
        this.banks = res;
        this.slimLoadingBarService.complete();
      }, err => {
        this.slimLoadingBarService.reset();
      });
  }

  deleteBank(id) {
    swal({
      title: "Are you sure?",
      text: "You will delete this cheque tempalte!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.projectsService
          .deleteBankChequeTemplate(id)
          .subscribe(
            (res: any) => {
              this.slimLoadingBarService.complete();
              swal("success", "Deleted cheque tempalte successfully!", "success");
              this.getBanksLists();
            },
            err => {
              console.log(err);
              this.slimLoadingBarService.reset();
            }
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

}
