import { Component, OnInit } from "@angular/core";
import { ProjectsService } from "../services/projects/projects.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";

import swal from "sweetalert2";
import { MarketingService } from "../services/marketing/marketing.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { parse, format } from 'date-fns';

@Component({
  selector: "app-campaigns",
  templateUrl: "./campaigns.component.html",
  styleUrls: ["./campaigns.component.css"],
})
export class CampaignsComponent implements OnInit {
  campaigns: any;
  campaignForm: FormGroup;
  disableAddCampaign: boolean = false;
  is_edit_mode: boolean = false;
  activeCampaign: any;
  currnet_campaign_id: any;
  pages: any[] = [];
  forms: any[] = [];
  leadChannels: any[] = [];
  channelSources: any[] = [];
  rotations: any[] = [];
  page: number = 1;
  page_length: number = 15;
  users: any[] = [];
  period_times: any[] = [
    { val: 1, name: "1 Hour" },
    { val: 2, name: "2 Hour" },
    { val: 4, name: "4 Hour" },
    { val: 6, name: "6 Hour" },
    { val: 8, name: "8 Hour" },
  ];

  constructor(
    private marketingService: MarketingService,
    private errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.createCampaignForm();
    this.getCampaigns();
    this.getPages();
    this.getChannels();
    this.getAllRotations();
    this.getCampaignViewers();
  }

  formatHours(time) {
    const parsedTime = parse(time, "HH:mm:ss", new Date());
    const formattedTime = format(parsedTime, "HH:mm");
    return formattedTime;
  }

  createCampaignForm(data?) {
    if (data) {
      this.campaignForm = this.formBuilder.group({
        name: [data.name || null, Validators.required],
        start_date: [data.start_date || null, Validators.required],
        end_date: [data.end_date || null, Validators.required],
        page_id: [data.page_id || null, Validators.required],
        external_form_id: [data.external_form_id || null, Validators.required],
        lead_channel_id: [data.lead_channel_id || null, Validators.required],
        channel_source_id: [
          data.channel_source_id || null,
          Validators.required,
        ],
        rotation_id: [data.rotation_id || null, Validators.required],
        max_period_for_take_action: [data.max_period_for_take_action || null, Validators.required],
        start_work_time: [data.start_work_time || null, Validators.required],
        end_work_time: [data.end_work_time || null, Validators.required],
        campaign_viewer_id: [
          data.campaign_viewer_id || null,
          Validators.required,
        ],
      });
    } else {
      this.campaignForm = this.formBuilder.group({
        name: [null, Validators.required],
        start_date: [null, Validators.required],
        end_date: [null, Validators.required],
        page_id: [null, Validators.required],
        external_form_id: [null, Validators.required],
        lead_channel_id: [null, Validators.required],
        channel_source_id: [null, Validators.required],
        rotation_id: [null, Validators.required],
        campaign_viewer_id: [null, Validators.required],
        max_period_for_take_action: [null, Validators.required],
        start_work_time: [null, Validators.required],
        end_work_time: [null, Validators.required],
      });
    }
  }

  getCampaigns() {
    this.slimLoadingBarService.start();
    this.marketingService
      .getCampaigns({ page: this.page, page_length: this.page_length })
      .subscribe(
        (res: any) => {
          this.slimLoadingBarService.complete();
          this.campaigns = res;
        },
        (err) => {
          this.slimLoadingBarService.reset();
        }
      );
  }

  getCampaignViewers() {
    this.slimLoadingBarService.start();
    this.marketingService.getCampaignViewers().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.users = res;
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  getPages() {
    this.slimLoadingBarService.start();
    this.marketingService.getPages().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.pages = res;
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  getChannels() {
    this.slimLoadingBarService.start();
    this.marketingService.getChannels().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.leadChannels = res;
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  getAllRotations() {
    this.slimLoadingBarService.start();
    this.marketingService.getAllRotations().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.rotations = res;
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  getSources() {
    this.leadChannels.forEach((element) => {
      if (element.id == this.campaignForm.value.lead_channel_id) {
        this.channelSources = element.sources;
      }
    });
  }

  getAllForms(id) {
    this.slimLoadingBarService.start();
    this.marketingService.getCampaignForms(id).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.forms = res.forms;
        let form_index = this.forms.findIndex(
          (x) => x.id == this.campaignForm.value.external_form_id
        );
        this.campaignForm.patchValue({
          external_form_id: res.forms[form_index].id,
        });
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  addCampaign() {}

  editCampain(data, modal) {
    data.start_work_time = this.formatHours(data.start_work_time);
    data.end_work_time = this.formatHours(data.end_work_time);
    this.is_edit_mode = true;
    this.currnet_campaign_id = data.id;
    this.activeCampaign = data;
    this.campaignForm.patchValue(data);
    this.getAllForms(this.campaignForm.get("page_id").value);
    this.getSources();
    modal.open();
  }

  addCampaignModalOnClose() {
    this.is_edit_mode = false;
    this.currnet_campaign_id = null;
    this.campaignForm.reset();
  }

  addCampainSubmit(modal) {
    let payload = this.campaignForm.value;
    this.disableAddCampaign = true;
    if (this.is_edit_mode) {
      this.slimLoadingBarService.start();
      this.marketingService
        .editCampaigns(this.currnet_campaign_id, payload)
        .subscribe(
          (res: any) => {
            this.getCampaigns();
            swal("Woohoo!", "Updated Campaign succesfully!", "success");
            modal.close();
            this.disableAddCampaign = false;
            this.getCampaigns();
            this.is_edit_mode = false;
            this.currnet_campaign_id = null;
            this.campaignForm.reset();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.disableAddCampaign = false;
          }
        );
    } else {
      this.slimLoadingBarService.start();
      this.marketingService.addCampaigns(payload).subscribe(
        (res: any) => {
          swal("Woohoo!", "Created Campaign succesfully!", "success");
          modal.close();
          this.disableAddCampaign = false;
          this.getCampaigns();
          this.campaignForm.reset();
        },
        (err) => {
            this.errorHandlerService.handleErorr(err);
          this.disableAddCampaign = false;
        }
      );
    }
  }

  deleteCampaign(id) {
    swal({
      title: "Are you sure?",
      text: "You will delete this campaign!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.marketingService.deleteCampaigns(id).subscribe(
          (res: any) => {
            this.getCampaigns();
            swal("success", "Deleted campaign successfully!", "success");
          },
          (err) => {
            swal(err.error.message, "", "error");
            this.slimLoadingBarService.reset();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  getNewRecord(event) {
    this.campaigns = event;
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
}
