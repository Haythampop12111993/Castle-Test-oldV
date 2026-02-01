import { LeadsService } from './../services/lead-service/lead-service.service';
import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { FinanceService } from './../services/finance/finance.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finance-balance-sheet',
  templateUrl: './finance-balance-sheet.component.html',
  styleUrls: ['./finance-balance-sheet.component.css']
})
export class FinanceBalanceSheetComponent implements OnInit {

  balanceSheet: any;
  accountID: any;
  last_page_url: any;
  pageTest: any = 1;
  is_refreshing: any;
  lg: any = 'lg';

  constructor(private errorHandlerService: ErrorHandlerService, private financeService: FinanceService,private  slimLoadingBarService: SlimLoadingBarService, private leadsService: LeadsService) { }

  ngOnInit() {
    this.accountID = window.localStorage.getItem('account_id');
    console.log(this.accountID);
    this.getBalanceSheet();
  }

  getBalanceSheet(){
    this.slimLoadingBarService.start();
    this.financeService.getBalanceSheet(this.accountID).subscribe((res: any) => {
      this.balanceSheet = res;
    }, err => this.errorHandlerService.handleErorr(err)
    , () => this.slimLoadingBarService.complete());
  }

  pageChange(event) {
    console.log(event);
    console.log(this.last_page_url);
    let arr = this.last_page_url.split('?');
    let selectedUrl = `${arr[0]}?page=${event}`;
    this.infinite(selectedUrl, event);
  }

  infinite(url, event) {
    this.leadsService.infinit(url).subscribe((res: any) => {
      this.balanceSheet = res;
      this.last_page_url = res.last_page_url;
    }, err => this.errorHandlerService.handleErorr(err));
  }

}
