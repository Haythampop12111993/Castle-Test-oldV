import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { LeadsService } from '../../services/lead-service/lead-service.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { UserServiceService } from '../../services/user-service/user-service.service';

@Component({
  selector: 'app-store-banks',
  templateUrl: './store-banks.component.html',
  styleUrls: ['./store-banks.component.css']
})
export class StoreBanksComponent implements OnInit {

  bank_export_url: any;
  search_bank_keyword: any;

  banks: any;

  broker_last_name: any;

  banks_raw_data: any;
  base_url_for_pagination: any;
  last_page_url: any;
  current_page: any;
  pageTest: any = 1;

  constructor(
    private userService: UserServiceService,
    private leadService: LeadsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private leadsService: LeadsService,
    private router: Router
  ) {
    this.bank_export_url = `${
      environment.api_base_url
      }store_banks/export?token=${window.localStorage.getItem('token')}`;
  }

  ngOnInit() {
    this.getBanks();
  }

  getBanks() {
    this.slimLoadingBarService.start();
    this.userService.getBanks().subscribe(
      (data: any) => {
        this.banks = data;
        console.log(this.banks);
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  editBank(id, index) {
    console.log(this.banks);
    window.localStorage.setItem('current_bank', JSON.stringify(this.banks[index]));
    this.router.navigate([`/pages/settings/store_banks/edit/${id}`]);
  }

  pageChange(ev) {
    const selectedUrl = `${this.base_url_for_pagination}?page=${ev}`;
    this.infinite(selectedUrl, ev);
  }

  infinite(url, event) {
    console.log(url);
    console.log('pagination ');
    this.leadsService.infinteWithPaginated(url).subscribe(
      (data: any) => {
        this.banks_raw_data = data;
        this.base_url_for_pagination = data.last_page_url.split('?')[0];
        this.last_page_url = data.last_page_url;
        data.data.forEach(element => {
          element.edit_mode = false;
        });
        this.banks = data.data;
        this.last_page_url = data.last_page_url;
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }
}
