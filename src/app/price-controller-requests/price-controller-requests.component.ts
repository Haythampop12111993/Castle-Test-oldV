import { LeadsService } from "./../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { ProjectsService } from "./../services/projects/projects.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";

@Component({
  selector: "app-price-controller-requests",
  templateUrl: "./price-controller-requests.component.html",
  styleUrls: ["./price-controller-requests.component.css"],
})
export class PriceControllerRequestsComponent implements OnInit {
  check_all = false;
  view = "Price Control Requests";
  requests: any;
  requests_history: any;
  lg: any = "lg";
  pageTest: any = 1;
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  userComment = "";
  listId;

  coming_soon: boolean = false;

  constructor(
    private projectsService: ProjectsService,
    private errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
    private leadsService: LeadsService
  ) {}

  ngOnInit() {
    this.getAllRequests();
    this.getAllRequestsHistory();
  }

  getAllRequests() {
    this.slimLoadingBarService.start();
    this.projectsService.listUnitPriceChangeRequests().subscribe(
      (res: any) => {
        res.data.forEach((e) => {
          e.check = false;
        });
        this.requests = res;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getAllRequestsHistory() {
    this.slimLoadingBarService.start();
    this.projectsService.controlPriceRequestsHistory().subscribe(
      (res: any) => {
        this.requests_history = res;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  onFilterChange(ev) {
    console.log(this.check_all);
    this.requests.data.forEach((e) => {
      if (this.check_all) {
        e.checked = true;
      } else {
        e.checked = false;
      }
    });
  }
  closeModal(modal) {
    modal.close();
  }

  approve(index, id, commentModal?) {
    swal({
      title: "Are you sure?",
      text: "You will approve this request!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "No.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.listId = id;
        if (
          this.userProfile.role === "Admin" ||
          this.userProfile.role === "Super Development"
        ) {
          if (commentModal) {
            commentModal.open();
          } else {
            this.approveToServer();
          }
        } else {
          this.projectsService
            .accountReviewUnitPriceChange(this.listId)
            .subscribe(
              (data) => {
                this.slimLoadingBarService.complete();
                this.getAllRequests();
                this.userComment = "";
              },
              (err) => {
                this.errorHandlerService.handleErorr(err);
                this.slimLoadingBarService.complete();
                this.userComment = "";
              }
            );
        }
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  approveToServer() {
    this.projectsService
      .adminApproveUnitPriceChange(this.listId, this.userComment)
      .subscribe(
        (resp: any) => {
          this.slimLoadingBarService.complete();
          this.getAllRequests();
          swal(resp, "", "success");
          this.userComment = "";
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
          this.userComment = "";
        }
      );
  }
  onSubmitCommentModal(commentModal) {
    this.approveToServer();
    commentModal.close();
  }

  decline(index, id) {
    swal({
      title: "Are you sure?",
      text: "You will decline this request!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, decline!",
      cancelButtonText: "No.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        if (
          this.userProfile.role === "Admin" ||
          this.userProfile.role === "Super Development"
        ) {
          this.projectsService.adminDeclineUnitPriceChange(id).subscribe(
            (data) => {
              this.slimLoadingBarService.complete();
              this.getAllRequests();
            },
            (err) => {
              this.errorHandlerService.handleErorr(err);
              this.slimLoadingBarService.complete();
            }
          );
        } else {
          this.projectsService.accountDeclineUnitPriceChange(id).subscribe(
            (data) => {
              this.slimLoadingBarService.complete();
              this.getAllRequests();
            },
            (err) => {
              this.errorHandlerService.handleErorr(err);
              this.slimLoadingBarService.complete();
            }
          );
        }
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  delete(index, id) {
    swal({
      title: "Are you sure?",
      text: "You will delete this request!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        if (
          this.userProfile.role === "Admin" ||
          this.userProfile.role === "Super Development"
        ) {
          this.projectsService.adminDeleteUnitPriceChange(id).subscribe(
            (data) => {
              this.slimLoadingBarService.complete();
              this.getAllRequests();
            },
            (err) => {
              this.errorHandlerService.handleErorr(err);
              this.slimLoadingBarService.complete();
            }
          );
        }
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  approveAll() {
    const ids = [];
    this.requests.data.forEach((e) => {
      if (e.checked) ids.push(e.id);
    });
    if (ids.length > 0) {
      swal({
        title: "Are you sure?",
        text: "You will approve all the requests!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, approve it!",
        cancelButtonText: "No.",
      }).then((result) => {
        if (result.value) {
          this.slimLoadingBarService.start();
          const payload = {
            requests_ids: ids,
          };
          if (
            this.userProfile.role === "Admin" ||
            this.userProfile.role === "Super Development"
          ) {
            this.projectsService
              .adminApproveUnitPriceChangeMultiple(payload)
              .subscribe(
                (data) => {
                  this.getAllRequests();
                  this.getAllRequestsHistory();
                  this.slimLoadingBarService.complete();
                },
                (err) => {
                  this.errorHandlerService.handleErorr(err);
                  this.slimLoadingBarService.complete();
                }
              );
          } else {
            this.projectsService
              .accountReviewUnitPriceChangeMultiple(payload)
              .subscribe(
                (data) => {
                  this.getAllRequests();
                  this.getAllRequestsHistory();
                  this.slimLoadingBarService.complete();
                },
                (err) => {
                  this.errorHandlerService.handleErorr(err);
                  this.slimLoadingBarService.complete();
                }
              );
          }
        } else if (result.dismiss) {
          swal("Cancelled", "", "error");
        }
      });
    }
  }

  declineAll() {
    const ids = [];
    this.requests.data.forEach((e) => {
      if (e.checked) ids.push(e.id);
    });
    if (ids.length > 0) {
      swal({
        title: "Are you sure?",
        text: "You will decline all!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, decline All!",
        cancelButtonText: "No.",
      }).then((result) => {
        if (result.value) {
          this.slimLoadingBarService.start();
          const payload = {
            requests_ids: ids,
          };
          if (
            this.userProfile.role === "Admin" ||
            this.userProfile.role === "Super Development"
          ) {
            this.projectsService
              .adminDeclineUnitPriceChangeMultiple(payload)
              .subscribe(
                (data) => {
                  this.getAllRequests();
                  this.slimLoadingBarService.complete();
                },
                (err) => {
                  this.errorHandlerService.handleErorr(err);
                  this.slimLoadingBarService.complete();
                }
              );
          } else {
            this.projectsService
              .accountDeclineUnitPriceChangeMultiple(payload)
              .subscribe(
                (data) => {
                  this.getAllRequests();
                  this.slimLoadingBarService.complete();
                },
                (err) => {
                  this.errorHandlerService.handleErorr(err);
                  this.slimLoadingBarService.complete();
                }
              );
          }
        } else if (result.dismiss) {
          swal("Cancelled", "", "error");
        }
      });
    }
  }

  viewChanged(ev) {
    if (this.view === "Availability Requests History") {
      this.getAllRequestsHistory();
    }
  }

  pageChange(event, type) {
    if(type == 'Requests') {
      const arr = this.requests.last_page_url.split("?");
      const selectedUrl = `${arr[0]}?page=${event}`;
      this.infinite(selectedUrl, type);
    } else {
      const arr = this.requests_history.last_page_url.split("?");
      const selectedUrl = `${arr[0]}?page=${event}`;
      this.infinite(selectedUrl, type);
    }
  }

  infinite(url, type) {
    if(type == 'Requests') {
      this.leadsService.infinit(url).subscribe(
        (res: any) => {
          this.requests = res;
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
    } else {
      this.leadsService.infinit(url).subscribe(
        (res: any) => {
          this.requests_history = res;
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
    }
  }

  exportUnitPriceRequest() {
    this.slimLoadingBarService.start();
    this.projectsService.exportUnitPriceRequest().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        window.open(res.url);
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  exportUnitPriceRequestsHistory() {
    this.slimLoadingBarService.start();
    this.projectsService.exportUnitPriceRequestsHistory().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        window.open(res.url);
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }
}
