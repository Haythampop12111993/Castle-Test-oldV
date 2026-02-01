import { Component, OnInit } from "@angular/core";
import { LeadsService } from "../services/lead-service/lead-service.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { ErrorHandlerService } from "../services/shared/error-handler.service";

@Component({
  selector: "app-blocklist",
  templateUrl: "./blocklist.component.html",
  styleUrls: ["./blocklist.component.css"],
})
export class BlocklistComponent implements OnInit {
  blocklist: any;
  disableAddCampaign: boolean = false;
  pageTest = 1;

  constructor(
    private leadsService: LeadsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.getBlocklists();
  }

  getBlocklists() {
    this.slimLoadingBarService.start();
    this.leadsService.getBlockList().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        console.log(res);
        this.blocklist = res;
      },
      (err) => {
        console.log(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  // addCampaign() {}

  // editCampain(data, modal) {
  //   this.is_edit_mode = true;
  //   this.currnet_campaign_id = data.id;
  //   this.createCampaignForm(data);
  //   modal.open();
  // }

  // addCampaignModalOnClose() {
  //   this.is_edit_mode = false;
  //   this.currnet_campaign_id = null;
  //   this.campaignForm.reset();
  // }

  // addCampainSubmit(modal) {
  //   let payload = this.campaignForm.value;
  //   console.log(payload);
  //   this.disableAddCampaign = true;
  //   if (this.is_edit_mode) {
  //     this.slimLoadingBarService.start();
  //     this.projectsService
  //       .updateCampaigns(this.currnet_campaign_id, payload)
  //       .subscribe(
  //         (res: any) => {
  //           this.getCampaigns();
  //           swal("Woohoo!", "Updated Campaign succesfully!", "success");
  //           modal.close();
  //           this.disableAddCampaign = false;
  //           this.getCampaigns();
  //           this.is_edit_mode = false;
  //           this.currnet_campaign_id = null;
  //           this.campaignForm.reset();
  //         },
  //         (err) => {
  //           console.log(err);
  //           swal("Error!", "Couldn't create campaign succesfully!", "error");
  //           this.disableAddCampaign = false;
  //         }
  //       );
  //   } else {
  //     this.slimLoadingBarService.start();
  //     this.projectsService.createCampaigns(payload).subscribe(
  //       (res: any) => {
  //         this.getCampaigns();
  //         swal("Woohoo!", "Created Campaign succesfully!", "success");
  //         modal.close();
  //         this.disableAddCampaign = false;
  //         this.getCampaigns();
  //         this.campaignForm.reset();
  //       },
  //       (err) => {
  //         console.log(err);
  //         swal("Error!", "Couldn't create campaign succesfully!", "error");
  //         this.disableAddCampaign = false;
  //       }
  //     );
  //   }
  // }

  editBlocklist(block) {
    window.localStorage.setItem("bloklist_data", JSON.stringify(block));
    this.router.navigateByUrl(`/pages/blocklist/manage/${block.id}`);
  }

  deleteBlocklist(block) {
    this.slimLoadingBarService.start();
    this.leadsService.deleteBlockList(block.id).subscribe(
      (res) => {
        this.slimLoadingBarService.complete();
        this.getBlocklists();
        swal("succeess", "deleted successfully", "success");
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  removeLeadFromBlocklist(block) {
    swal({
      title: "Are you sure?",
      text: "you will remove this lead from the blocklist!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.leadsService.removeLeadFromBlockList(block.lead_id).subscribe(
          (data) => {
            console.log(data);
            swal("success", "Removed from blocklist successfully", "success");
            this.getBlocklists();
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.reset();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  goToLead(lead) {
    this.router.navigate(["/pages/leads"], {
      queryParams: {
        lead_id: lead.id,
      },
    });
  }

  pageChange(event) {
    let arr = this.blocklist.last_page_url.split("?");
    let selectedUrl = `${arr[0]}?page=${event}`;
    // if (this.filterActive) {
    //   this.infiniteWithFilter(selectedUrl, event);
    // } else {
    // }
    this.infinite(selectedUrl, event);
  }

  infinite(url, number) {
    this.slimLoadingBarService.start();
    this.leadsService.infinit(url).subscribe(
      (data: any) => {
        this.blocklist = data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }
}
