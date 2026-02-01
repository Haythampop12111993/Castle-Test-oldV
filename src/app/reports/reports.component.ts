import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { LeadsService } from './../services/lead-service/lead-service.service';
import { ReservationService } from './../services/reservation-service/reservation.service';
import { MarketingService } from './../services/marketing/marketing.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { UserServiceService } from './../services/user-service/user-service.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportTypes: any = ['Leads', 'Reservations', 'Units'];
  reprotForm: FormGroup;
  columns_list: any;
  status_list: any;
  dropdownList = [];
  selectedItems: any = [];
  dataLoaded: any = false;
  columns: any = [];
  reportData: any;
  reportRawData: any;
  pageTest: any = 1;
  next_page_url: any;
  lg: any = 'lg';
  reportForm: FormGroup;
  report_on: any;
  status: any;
  arrSearch: any;
  dataFromSearch: any;
  leadSources: any;
  coulmns: any;
  columnsList: any = [];
  statusList: any = [];
  projects: any;
  channels: any;
  channelDropDownList: any = [];
  dropdownSettings = { classes: 'height-auto' };
  tableReadyToRendered = false;
  tableHead: any;
  tableBody: any;
  tableData: any;
  paginateData: any;

  constructor(
    private userService: UserServiceService,
    private errorHandlerService: ErrorHandlerService,
    private formBuilder: FormBuilder,
    private slimLoadingService: SlimLoadingBarService,
    private leadsService: LeadsService,
    public http: HttpClient,
    private reservationService: ReservationService,
    private marketingService: MarketingService
  ) {}

  ngOnInit() {
    this.createForm();
    this.leadSource();
    this.getChannels();
  }

  createForm() {
    this.reportForm = this.formBuilder.group({
      status: [[], Validators.required],
      report_type: ['', Validators.required],
      filter_by: ['', Validators.required],
      generate_type: ['PDF', Validators.required],
      chosenType: [''],
      filter_by_id: [''],
      from: [''],
      to: [''],
      is_accountant_approved: ['Not Important'],
      is_contractor_approved: ['Not Important'],
      cheque_recieved: ['Not Important'],
      client_signature: ['Not Important'],
      is_refunded: ['Not Important'],
      channel: [[]],
      sources: [[]]
    });
  }

  getChannels() {
    this.slimLoadingService.start();
    this.marketingService.getChannels().subscribe(
      (res: any) => {
        this.channels = res;
        this.channels.forEach(e => {
          let data = {
            id: e.id,
            itemName: e.name
          };
          this.channelDropDownList.push(data);
        });
        console.log(this.channelDropDownList);
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingService.complete()
    );
  }

  onChannelSelect(ev) {
    this.calculateSources();
  }

  calculateSources() {
    this.dropdownList = [];
    this.reportForm.get('channel').value.forEach(e => {
      this.channels.forEach(secondE => {
        if (e.id == secondE.id) {
          secondE.sources.forEach(thirdE => {
            let item = {
              id: thirdE.id,
              itemName: thirdE.name
            };
            this.dropdownList.push(item);
          });
        }
      });
    });
    console.log(this.dropdownList);
  }

  OnChannelDeSelect(ev) {
    console.log(this.channelDropDownList);
    if (this.reportForm.get('channel').value.length != 0) {
      this.calculateSources();
    } else {
      this.dropdownList = [];
      console.log(this.dropdownList);
    }
  }

  onChannelSelectAll(ev) {
    this.calculateSources();
  }

  onChannelDeSelectAll(ev) {
    if (this.reportForm.get('channel').value.length != 0) {
      this.calculateSources();
    } else {
      this.dropdownList = [];
    }
  }

  leadSource() {
    this.leadSources = null;
    var data = this.leadsService.leadSource();
    let id = 0;
    data.forEach(e => {
      let data = {
        id: id,
        itemName: e.text
      };
      id++;
      this.dropdownList.push(data);
    });
    console.log(this.dropdownList);
  }

  observableSource = (keyword: any): any => {
    let baseUrl: string = environment.api_base_url;
    let data = {
      keyword: keyword,
      filter_by: this.reportForm.get('filter_by').value
    };
    if (keyword) {
      return this.http
        .post(`${baseUrl}reports/search_filter`, JSON.stringify(data))
        .map((res: any) => {
          console.log(res.length);
          if (res.length == 0) {
            let arr = [];
            return arr;
          } else {
            this.arrSearch = [];
            this.dataFromSearch = res;
            res.forEach(e => {
              this.arrSearch.push(e.name);
            });
            // console.log(arr);
            return this.arrSearch;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  filterBy(ev) {
    console.log(ev);
    let agent_id: number;
    this.dataFromSearch.forEach(e => {
      if (e.name == ev) {
        this.reportForm.get('filter_by_id').patchValue(e.id);
        console.log(this.reportForm.get('filter_by_id').value);
      }
    });
  }

  typeChange() {
    this.reprotForm.get('filter_by').valueChanges.subscribe(val => {});
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  OnItemDeSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  onDeSelectAll(items: any) {
    console.log(items);
  }

  generate() {
    this.tableReadyToRendered = false;
    const form = this.reportForm.value;
    let payload;
    if (this.report_on == 'Leads') {
      if (form.report_type == 'Summary') {
        payload = {
          report_on: this.report_on,
          report_type: form.report_type,
          filter_by_id: form.filter_by_id,
          filter_by: form.filter_by,
          status: form.status,
          from: form.from,
          to: form.to,
          sources: []
        };
      } else {
        let columns_ids = [];
        form.columns_ids.forEach(e => {
          columns_ids.push(e.id);
        });
        payload = {
          report_on: this.report_on,
          report_type: form.report_type,
          filter_by_id: form.filter_by_id,
          filter_by: form.filter_by,
          status: form.status,
          from: form.from,
          to: form.to,
          sources: [],
          columns_ids: columns_ids
        };
      }
      if (form.sources) {
        form.sources.forEach(e => {
          payload.sources.push(e.itemName);
        });
      }
      if (form.status) {
        payload.status = [];
        form.status.forEach(e => {
          payload.status.push(e.itemName);
        });
      }
      payload.generate_type = form.generate_type;
      console.log(payload);
      this.slimLoadingService.start();
      this.userService.generateReport(payload).subscribe(
        (res: any) => {
          if (form.generate_type == 'Table') {
            this.tableReadyToRendered = true;
            this.tableHead = res.headerArr;
            this.tableBody = res.bodyArr;
            this.tableData = res;
          } else {
            this.tableReadyToRendered = false;
            window.open(res);
          }
          this.slimLoadingService.complete();
        },
        err => this.errorHandlerService.handleErorr(err)
      );
    } else if (this.report_on == 'Reservations') {
      if (form.report_on == 'Summary') {
        payload = {
          report_on: this.report_on,
          report_type: form.report_type,
          filter_by_id: form.filter_by_id,
          filter_by: form.filter_by,
          project_id: form.project_id,
          from: form.from,
          to: form.to,
          status: form.status,
          is_accountant_approved: form.is_accountant_approved,
          is_contractor_approved: form.is_contractor_approved,
          cheque_recieved: form.cheque_recieved,
          client_signature: form.client_signature,
          is_refunded: form.is_refunded
        };
      } else {
        let columns_ids = [];
        if (form.columns_ids) {
          form.columns_ids.forEach(e => {
            columns_ids.push(e.id);
          });
        }
        payload = {
          report_on: this.report_on,
          report_type: form.report_type,
          filter_by_id: form.filter_by_id,
          filter_by: form.filter_by,
          status: form.status,
          project_id: form.project_id,
          from: form.from,
          to: form.to,
          columns_ids: columns_ids,
          is_accountant_approved: form.is_accountant_approved,
          is_contractor_approved: form.is_contractor_approved,
          cheque_recieved: form.cheque_recieved,
          client_signature: form.client_signature,
          is_refunded: form.is_refunded
        };
      }
      if (form.status) {
        payload.status = [];
        form.status.forEach(e => {
          payload.status.push(e.itemName);
        });
      }
      payload.generate_type = form.generate_type;
      console.log(form);
      console.log(payload);
      this.slimLoadingService.start();
      this.userService.generateReport(payload).subscribe(
        (res: any) => {
          if (form.generate_type == 'Table') {
            this.paginateData = payload;
            this.tableReadyToRendered = true;
            this.tableHead = res.headerArr;
            this.tableBody = res.bodyArr;
            this.tableData = res;
          } else {
            this.tableReadyToRendered = false;
            window.open(res);
          }
          this.slimLoadingService.complete();
        },
        err => this.errorHandlerService.handleErorr(err)
      );
    }
  }

  onChange(event) {
    this.reportForm.reset();
    this.statusList = [];
    this.reportForm.get('status').setValue([]);
    this.getStatusAndColumns();
    if (this.report_on == 'Reservations') {
      this.getProjects();
      this.reportForm.addControl('project_id', new FormControl(''));
    }
  }

  getProjects() {
    this.reservationService.getProjects().subscribe(
      (res: any) => {
        this.projects = res;
      },
      err => console.log(err)
    );
  }

  getStatusAndColumns() {
    const payload = {
      report_on: this.report_on
    };
    this.slimLoadingService.start();
    this.userService.reportsStatus(payload).subscribe(
      (res: any) => {
        this.status = res.status_list;
        let status_id: any = 0;
        this.status.forEach(e => {
          const data = {
            id: status_id,
            itemName: e
          };
          status_id++;
          this.statusList.push(data);
        });
        this.columnsList = [];
        res.columns_list.forEach(e => {
          const data = {
            id: e.id,
            itemName: e.value
          };
          this.columnsList.push(data);
        });
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingService.complete()
    );
  }

  reportTypeChange(ev) {
    if (this.reportForm.get('report_type').value == 'Summary') {
      this.reportForm.removeControl('columns_ids');
    } else if (this.reportForm.get('report_type').value == 'Detailed') {
      this.reportForm.addControl(
        'columns_ids',
        new FormControl([], Validators.required)
      );
    }
  }

  pageChange(event) {
    console.log(event);
    this.userService.paginateReport(this.paginateData, event).subscribe(
      (res: any) => {
        this.tableHead = res.headerArr;
        this.tableBody = res.bodyArr;
        // this.tableData = res;
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }
}
