import { LeadsService } from './../services/lead-service/lead-service.service';
import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { FinanceService } from './../services/finance/finance.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finance-accounts',
  templateUrl: './finance-accounts.component.html',
  styleUrls: ['./finance-accounts.component.css']
})
export class FinanceAccountsComponent implements OnInit {

  accounts: any;
  pageTest: any = 1;
  last_page_url: any;
  filterActive: any = false;
  is_refreshing: any;
  lg: any = 'lg';

  constructor(private slimLoadingBarService: SlimLoadingBarService, private financeService: FinanceService, private errorHandlerService: ErrorHandlerService, private leadsService: LeadsService) { }

  ngOnInit() {
    this.getFinanceAccounts();
  }

  pageChange(event) {
    console.log(event);
    // this.paginate(event);
    console.log(this.last_page_url);
    let arr = this.last_page_url.split('?');
    let selectedUrl = `${arr[0]}?page=${event}`;
    // if (this.filterActive) {
    //   this.infiniteWithFilter(selectedUrl, event)
    // } else {
    //   this.infinite(selectedUrl, event);
    // }
    this.infinite(selectedUrl, event);
  }

  infinite(url, event) {
    this.leadsService.infinit(url).subscribe((res: any) => {
      this.accounts = res;
      this.last_page_url = res.last_page_url;
    }, err => this.errorHandlerService.handleErorr(err));
  }

  infiniteWithFilter(url, event) {

  }

  getFinanceAccounts() {
    this.slimLoadingBarService.start();
    this.financeService.getAllFinanceAccounts().subscribe((res: any) => {
      this.accounts = res;
      this.last_page_url = res.last_page_url;
    }, err => this.errorHandlerService.handleErorr(err)
      , () => this.slimLoadingBarService.complete());
  }

  addBalanceSheetId(id) {
    window.localStorage.setItem('account_id', id);
  }

}
