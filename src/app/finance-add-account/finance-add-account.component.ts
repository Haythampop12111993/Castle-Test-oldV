import { FinanceService } from './../services/finance/finance.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { UserServiceService } from './../services/user-service/user-service.service';
import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { environment } from './../../environments/environment';
import { NgZone, ViewEncapsulation, ViewChild, NgModule, Renderer2, AfterViewInit, Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, NgForm, NgModel, Validators, ValidatorFn, FormGroup, FormControl } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgClass } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'app-finance-add-account',
  templateUrl: './finance-add-account.component.html',
  styleUrls: ['./finance-add-account.component.css']
})
export class FinanceAddAccountComponent implements OnInit {

  accountForm: FormGroup;
  account_id: any;
  is_edit: boolean;
  types: any[] = ['Income', 'Cash', 'Expense'];
  account_data: any;
  page_loaded: boolean = false;
  parents: any;

  constructor(private fb: FormBuilder, private router: Router, vRef: ViewContainerRef, private slimLoadingBarService: SlimLoadingBarService, public route: ActivatedRoute, public errorHandlerService: ErrorHandlerService, public renderer2: Renderer2, private userService: UserServiceService, private financeService: FinanceService) { }

  ngOnInit() {
    this.getParents();
    this.route.params.subscribe(params => {
      this.account_id = +params['id'];
      if (this.account_id == 0) {
        this.is_edit = false;
        this.createForm();
        this.transactionTypeChanges();
      } else {
        this.is_edit = true;
        this.createEditForm();
      }
    })
  }

  createEditForm() {
    this.slimLoadingBarService.start();
    this.financeService.getFinanceAccountDetails(this.account_id).subscribe((res: any) => {
      this.accountForm = this.fb.group({
        name: [res.name, Validators.required],
        description: res.description
      })
      this.account_data = res;
      this.page_loaded = true;
    }, err => this.errorHandlerService.handleErorr(err)
    , () => this.slimLoadingBarService.complete() );
  }

  transactionTypeChanges() {
    this.accountForm.get('account_level').valueChanges.subscribe(val => {
      console.log(val);
      if (val == 'parent_account') {
        this.accountForm.removeControl('initial_balance');
        this.accountForm.removeControl('parent_id');
        this.accountForm.addControl('name', new FormControl('', Validators.required))
        this.accountForm.addControl('description', new FormControl(''))
        this.accountForm.addControl('type', new FormControl('', Validators.required))
        console.log(this.accountForm.value);
      } else if (val == 'sub_account') {
        this.accountForm.addControl('name', new FormControl('', Validators.required))
        this.accountForm.addControl('description', new FormControl(''))
        this.accountForm.addControl('initial_balance', new FormControl('', Validators.required))
        this.accountForm.addControl('type', new FormControl('', Validators.required))
        this.accountForm.addControl('parent_id', new FormControl('', Validators.required))
      }
    });
  }

  createForm() {
    this.accountForm = this.fb.group({
      account_level: ['', Validators.required]
      // name: ['', Validators.required],
      // type: ['', Validators.required],
      // description: [''],
      // parent_id : ['', Validators.required],
      // initial_balance: ['', Validators.required]
    })
    this.page_loaded = true;
  }

  getParents(){
    this.slimLoadingBarService.start();
    this.financeService.getParentsAccounts().subscribe((res: any) => {
      this.parents = res;
    }, err => this.errorHandlerService.handleErorr(err)
    , () => this.slimLoadingBarService.complete());
  }

  addAccount() {
    if (this.is_edit) {
      let payload = this.accountForm.value;
      this.slimLoadingBarService.start();
      this.financeService.editFinanceAccount(this.account_data.id, payload).subscribe(res => {
        swal(`Edit ${payload.name} successfully`, '', 'success');
        this.router.navigate(['/pages/finance/accounts']);
      }, err => this.errorHandlerService.handleErorr(err)
      , () => this.slimLoadingBarService.complete());
    } else {
      this.slimLoadingBarService.start();
      let payload = this.accountForm.value;
      console.log(payload);
      this.financeService.addFinanceAccount(payload).subscribe(res => {
        swal(`Added ${payload.name} account successfully`, '', 'success');
        this.createForm();
        this.router.navigate(['/pages/finance/accounts']);
      }, err => this.errorHandlerService.handleErorr(err)
        , () => this.slimLoadingBarService.complete());
    }
  }

}
