import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import swal from "sweetalert2";
import { LeadCampaignsService } from "../../services/lead-service/lead-campaigns.service";

@Component({
  selector: "app-lead-campaign",
  templateUrl: "./lead-campaign.component.html",
  styleUrls: ["./lead-campaign.component.css"],
})
export class LeadCampaignComponent implements OnInit {
  // list data
  page_data = {
    data: [],
    payload: {
      paginate: true,
      page: 1,
    },
    meta: {
      total_pages: 0,
    },
  };

  // form
  form_data = {
    name: "",
  };
  current_selected_campaign: any;

  constructor(
    private leadCampaignsService: LeadCampaignsService,
    private errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit() {
    this.fetchCampaings();
  }

  fetchCampaings() {
    this.leadCampaignsService
      .getCampaignsList(this.page_data.payload)
      .subscribe(
        (data: any) => {
          this.page_data.data = data.data;
          this.page_data.meta.total_pages = data.last_page;
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
  }

  pageChange(page) {
    this.fetchCampaings();
  }

  // actions
  editAction(campaign) {
    this.current_selected_campaign = campaign;
    this.form_data.name = this.current_selected_campaign.name;
  }

  deleteAction(id) {
    this.leadCampaignsService.deleteCampaign(id).subscribe(
      (data: any) => {
        swal(
          `Campaign ${
            this.current_selected_campaign ? "updated" : "added"
          } successfully`,
          "",
          "success"
        );
        this.fetchCampaings();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  saveForm() {
    const campaignData = {
      name: this.form_data.name,
    };
    let request;
    if (this.current_selected_campaign) {
      request = this.leadCampaignsService.updateCampaign(
        this.current_selected_campaign.id,
        campaignData
      );
    } else {
      request = this.leadCampaignsService.createCampaign(campaignData);
    }

    request.subscribe(
      (data: any) => {
        this.fetchCampaings();
        this.resetForm();
        swal("Campaign added successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  resetForm() {
    this.current_selected_campaign = undefined;
    this.form_data.name = "";
  }
}
