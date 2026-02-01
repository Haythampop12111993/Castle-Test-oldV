import { Component, OnInit } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';
import { LeadsService } from '../services/lead-service/lead-service.service';
import { ErrorHandlerService } from '../services/shared/error-handler.service';

@Component({
  selector: 'app-trash-leads',
  templateUrl: './trash-leads.component.html',
  styleUrls: ['./trash-leads.component.css']
})
export class TrashLeadsComponent implements OnInit {

  trashed_raw_data: any = [];
  trashed_leads: any;
  last_page_url: any;

  current_page: any;
  per_page: any;
  total: any;
  totalRec: any;
  pageTest: any = 1;
  lg = 'lg';
  agents: any;
  agent_id: any;

  constructor(
    private leadsService: LeadsService, 
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService
    ) { }

  ngOnInit() {
    this.getAgents();
    this.getTrashedLeads();
  }

  getAgents() {
    this.agents = null;
    this.leadsService.getAgents().subscribe(
      (data: any) => {
        this.agents = data;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  getTrashedLeads() {
    this.slimLoadingBarService.start();
    this.leadsService.getTrashedLeads()
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        this.trashed_raw_data = res;
        this.trashed_leads = res.data;
        this.last_page_url = res.last_page_url;
        this.current_page = 1;
        this.per_page = res.to;
        this.total = res.total;
        this.totalRec = res.total;
      }, err => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      });
  }
  
  pageChange(event) {
    let arr = this.last_page_url.split('?');
    let selectedUrl = `${arr[0]}?page=${event}`;
    this.infinite(selectedUrl, event);
  }

  infinite(url, number) {
    this.slimLoadingBarService.start();
    this.leadsService.infinit(url).subscribe(
      (data: any) => {
        this.trashed_raw_data = data;
        this.trashed_leads = data.data;
        this.totalRec = data.total;
        this.current_page = number;
        this.per_page = data.to;
        this.total = data.total;
        this.slimLoadingBarService.complete();
      },
      err => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  restorLeadModalOnClose() {

  }

  restorLeadSubmit(id, modal) {
    if (!this.agent_id) {
      swal('error', 'you must select agent first.', 'error');
      return;
    }
    let payload = {
      agent_id: this.agent_id
    }
    console.log(payload);
    this.slimLoadingBarService.start();
    this.leadsService.restoreTrashLead(id, payload)
      .subscribe((res: any) => {
        this.getTrashedLeads();
        this.slimLoadingBarService.complete();
        this.agent_id = null;
        swal('success', 'restored the lead successfully', 'success');
        modal.close();
      }, err => {
        console.log(err);
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      });
  }
}
