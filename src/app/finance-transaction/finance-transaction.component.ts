import { LeadsService } from './../services/lead-service/lead-service.service';
import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { FinanceService } from './../services/finance/finance.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finance-transaction',
  templateUrl: './finance-transaction.component.html',
  styleUrls: ['./finance-transaction.component.css']
})
export class FinanceTransactionComponent implements OnInit {

  transactions: any[];
  transaction_raw_data: any;
  pageTest: any = 1;
  last_page_url: any;
  is_refreshing: any;
  lg: any = 'lg';

  constructor(private errorHandlerService: ErrorHandlerService, private financeService: FinanceService, private slimLoadingBarService: SlimLoadingBarService, private leadsService: LeadsService) { }

  ngOnInit() {
    this.getTransactions();
  }

  getTransactions(){
    this.slimLoadingBarService.start();
    this.financeService.getAllTransaction().subscribe((res: any) => {
      this.transaction_raw_data = res;
      this.transactions = res.data;
      this.last_page_url = res.last_page_url;
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
      this.transaction_raw_data = res;
      this.transactions = res.data;
      this.last_page_url = res.last_page_url;
    }, err => this.errorHandlerService.handleErorr(err));
  }
}
