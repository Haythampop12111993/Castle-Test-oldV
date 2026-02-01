import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { LeadsService } from '../services/lead-service/lead-service.service';
import { ErrorHandlerService } from '../services/shared/error-handler.service';

@Component({
  selector: 'app-listing-leads-by-reminders',
  templateUrl: './listing-leads-by-reminders.component.html',
  styleUrls: ['./listing-leads-by-reminders.component.css']
})
export class ListingLeadsByRemindersComponent implements OnInit {

  activeTab: String = 'today';
  today_leads: any;
  today_leads_current_page: any;
  today_leads_per_page: any;
  today_leads_total: any;
  today_leads_totalRec: any;
  today_leads_pageTest: any = 1;
  today_leads_lg = 'lg';
  today_leads_raw_data: any;
  today_leads_last_page_url: any;

  past_leads: any;
  past_leads_current_page: any;
  past_leads_per_page: any;
  past_leads_total: any;
  past_leads_totalRec: any;
  past_leads_pageTest: any = 1;
  past_leads_lg = 'lg';
  past_leads_raw_data: any;
  past_leads_last_page_url: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private leadService: LeadsService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
  this.getLeadByTodayActivities();
  }

  setActiveTab(activeTab: String) {
    this.activeTab = activeTab;
    if (this.activeTab == 'today') {
      this.getLeadByTodayActivities();
    } else if (this.activeTab == 'past') {
      this.getLeadByPastActivities();
    }
  }

  getLeadByPastActivities() {
    this.slimLoadingBarService.start();
    this.leadService.getLeadByPastActivities()
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        this.past_leads = res.data;
        this.past_leads_raw_data = res;
        this.past_leads_last_page_url = res.last_page_url;
        this.past_leads_current_page = 1;
        this.past_leads_per_page = res.to;
        this.past_leads_total = res.total;
        this.past_leads_totalRec = res.total;
      }, err => {
        this.slimLoadingBarService.reset();
      });
  }

  getLeadByTodayActivities() {
    this.slimLoadingBarService.start();
    this.leadService.getLeadsByTodayActivities()
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        this.today_leads = res.data;
        this.today_leads_raw_data = res;
        this.today_leads_last_page_url = res.last_page_url;
        this.today_leads_current_page = 1;
        this.today_leads_per_page = res.to;
        this.today_leads_total = res.total;
        this.today_leads_totalRec = res.total;
      }, err => {
        this.slimLoadingBarService.reset();
      });
  }

  pageChangeTodayLeads(event) {
    let arr = this.today_leads_last_page_url.split('?');
    let selectedUrl = `${arr[0]}?page=${event}`;
    this.infiniteTodayLeads(selectedUrl, event);
  }

  infiniteTodayLeads(url, number) {
    this.slimLoadingBarService.start();
    this.leadService.infinit(url).subscribe(
      (data: any) => {
        this.today_leads_raw_data = data;
        this.today_leads = data.data;
        this.today_leads_totalRec = data.total;
        this.today_leads_current_page = number;
        this.today_leads_per_page = data.to;
        this.today_leads_total = data.total;
        this.slimLoadingBarService.complete();
      },
      err => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  pageChangePastLeads(event) {
    let arr = this.past_leads_last_page_url.split('?');
    let selectedUrl = `${arr[0]}?page=${event}`;
    this.infinitePastLeads(selectedUrl, event);
  }

  infinitePastLeads(url, number) {
    this.slimLoadingBarService.start();
    this.leadService.infinit(url).subscribe(
      (data: any) => {
        this.past_leads_raw_data = data;
        this.past_leads = data.data;
        this.past_leads_totalRec = data.total;
        this.past_leads_current_page = number;
        this.past_leads_per_page = data.to;
        this.past_leads_total = data.total;
        this.slimLoadingBarService.complete();
      },
      err => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }
  
  goToThisLead(leadId) {
    this.router.navigate(['/pages/leads'], {
      queryParams: {
        lead_id: leadId
      }
    });
  }

}
