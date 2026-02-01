import { Subject } from 'rxjs/Subject';
import { FinanceService } from './../services/finance/finance.service';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';

import swal from 'sweetalert2';

@Component({
  selector: 'app-finance-add-transaction',
  templateUrl: './finance-add-transaction.component.html',
  styleUrls: ['./finance-add-transaction.component.css']
})
export class FinanceAddTransactionComponent implements OnInit {

  transactionForm: FormGroup;
  options: any = ['test 1', 'test 2'];
  arrSearch: any;
  dataFromSearch: any;
  fromList: any = [{
    name: 'Nothing',
  }];
  fromSearchKeyowrd: any = '';
  toList: any = [{
    name: 'Nothing',
  }]
  currentFromList: any;
  currentToList: any;
  test: any;
  loadingData: any;
  type: any;
  @ViewChild('from') from: ElementRef;
  @ViewChild('to') to: ElementRef;
  private unsubscribe = new Subject<void>();


  constructor(private slimLoadingBarService: SlimLoadingBarService, private router: Router, private errorHandlerService: ErrorHandlerService, private fb: FormBuilder, private http: HttpClient, private financeService: FinanceService) {
    this.createTransactionForm();
    this.transactionTypeChanges();
  }

  ngOnInit() {

  }

  searchfrom(event) {
    console.log(event);
    console.log(this.transactionForm.get('from').value);
    if (this.transactionForm.get('from').value) {
      let payload = {
        type: this.transactionForm.get('type').value,
        form_account: this.transactionForm.get('from').value
      }
      this.slimLoadingBarService.start();
      this.financeService.searchFrom(payload).subscribe((res: any) => {
        console.log(res);
        if (res.length == 0) this.fromList = [];
        else this.fromList = res;
        console.log(this.fromList);
      }
        , (err) => this.errorHandlerService.handleErorr(err)
        , () => this.slimLoadingBarService.complete());
    }
  }

  searchTo() {
    console.log(event);
    console.log(this.transactionForm.get('to').value);
    if (this.transactionForm.get('to').value) {
      let payload = {
        type: this.transactionForm.get('type').value,
        to_account: this.transactionForm.get('to').value
      }
      // this.unsubscribe.next();
      // this.unsubscribe.complete();
      this.slimLoadingBarService.start();
      this.financeService.searchTo(payload).takeUntil(this.unsubscribe).subscribe((res: any) => {
        console.log(res);
        if (res.length == 0) this.toList = [];
        else this.toList = res;
        console.log(this.toList);
      }
        , (err) => this.errorHandlerService.handleErorr(err)
        , () => this.slimLoadingBarService.complete());
    }
  }

  transactionTypeChanges() {
    this.transactionForm.get('type').valueChanges.subscribe(val => {
      if (val) {
        this.transactionForm.addControl('from', new FormControl('', Validators.required))
        this.transactionForm.addControl('to', new FormControl('', Validators.required))
        this.transactionForm.addControl('amount', new FormControl('', Validators.required))
        this.transactionForm.addControl('date', new FormControl('', Validators.required))
        this.transactionForm.addControl('description', new FormControl(''))
        this.transactionForm.addControl('cheque_date', new FormControl(''))
        this.transactionForm.addControl('cheque_number', new FormControl(''))
        console.log(this.transactionForm.value);
      } else {
      }
    });
  }

  createTransactionForm() {
    this.transactionForm = this.fb.group({
      type: ['', Validators.required],
    })
  }

  submit() {
    let formData = this.transactionForm.value;
    let fromFound = false;
    let toFound = false;
    console.log(this.transactionForm);
    this.fromList.forEach(e => {
      if (e.name == this.from.nativeElement.value) {
        fromFound = true;
        formData.from_account = e.id;
      }
    });
    this.toList.forEach(e => {
      if (e.name == this.to.nativeElement.value) {
        toFound = true;
        formData.to_account = e.id;
      }
    })
    if (!fromFound) {
      swal(`${formData.from} is not a valid From Account`, '', 'error');
    } else if (!toFound) {
      swal(`${formData.to} is not a valid To Account`, '', 'error');
    } else {
      console.log(formData);
      this.slimLoadingBarService.start();
      this.financeService.addTransaction(formData).subscribe((res: any) => {
        this.createTransactionForm();
        swal('Added transaction successfully', '', 'success');
      }, err => this.errorHandlerService.handleErorr(err)
      , () => this.slimLoadingBarService.complete());
    }
  }
}
