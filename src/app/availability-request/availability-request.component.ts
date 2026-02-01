import { LeadsService } from './../services/lead-service/lead-service.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { ProjectsService } from './../services/projects/projects.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-availability-request',
  templateUrl: './availability-request.component.html',
  styleUrls: ['./availability-request.component.css']
})
export class AvailabilityRequestComponent implements OnInit {

  check_all = false;
  requests: any;
  view = 'Availability Requests';
  requests_history: any;
  lg: any = 'lg';
  pageTest: any = 1;
  userProfile: any = JSON.parse(window.localStorage.getItem('userProfile'));
  listId;
  listIndex;
  userComment = '';

  coming_soon: boolean = true;
  
  constructor(private projectsService: ProjectsService,
    private errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
    private leadsService: LeadsService) { }

  ngOnInit() {
    this.getAllRequests();
    this.getAllRequestsHistory();
  }

  getAllRequests() {
    this.slimLoadingBarService.start();
    this.projectsService.getUnitsAvailableRequests()
      .subscribe((res: any) => {
        res.forEach(e => {
          e.check = false;
        });
        this.requests = res;
      }, err => this.errorHandlerService.handleErorr(err)
      , () => this.slimLoadingBarService.complete());
  }

  getAllRequestsHistory() {
    this.slimLoadingBarService.start();
    this.projectsService.availabilityRequestsHistory()
      .subscribe((res: any) => {
        this.requests_history = res;
      }, err => this.errorHandlerService.handleErorr(err)
      , () => this.slimLoadingBarService.complete());
  }

  onFilterChange(ev) {
    console.log(this.check_all);
    this.requests.forEach(e => {
      if (this.check_all) {
        e.checked = true;
      } else {
        e.checked = false;
      }
    });
  }

  approve(index, id, commentModal?) {
    swal({
      title: 'Are you sure?',
      text: 'You will unlock this unit!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unlock it!',
      cancelButtonText: 'No, keep it locked.'
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.listId = id;
        if (commentModal) {
          commentModal.open();
        } else {
          this.approveToServer();
        }
      } else if (result.dismiss) {
        swal('Cancelled', '', 'error');
      }
    });
  }

  approveToServer(commentModal?) {
    this.projectsService.approveUnitAvailableRequests(this.listId, this.userComment).subscribe((resp: any) => {
      this.requests.splice(this.listIndex, 1);
      this.slimLoadingBarService.complete();
      this.getAllRequests();
      this.userComment = '';
      swal(resp, '', 'success');
      this.slimLoadingBarService.stop();
      if (commentModal) commentModal.close();
    }, err => {
      this.slimLoadingBarService.stop();
      this.errorHandlerService.handleErorr(err);
      this.slimLoadingBarService.complete();
      this.userComment = '';
    });
  }

  onSubmitCommentModal(commentModal) {
    this.slimLoadingBarService.start();
    this.approveToServer(commentModal);
  }

  decline(index, id) {
    swal({
      title: 'Are you sure?',
      text: 'You will decline this request!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, decline!',
      cancelButtonText: 'No.'
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.projectsService.declineUnitAvailableRequests(id).subscribe(data => {
          this.requests.splice(index, 1);
          this.slimLoadingBarService.complete();
        }, err => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        });
      } else if (result.dismiss) {
        swal('Cancelled', '', 'error');
      }
    });
  }

  delete(index, id) {
    swal({
      title: 'Are you sure?',
      text: 'You will delete this request!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it.'
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.projectsService.deleteUnitAvailableRequests(id).subscribe(data => {
          this.requests.splice(index, 1);
          this.slimLoadingBarService.complete();
          // this.getAllRequests();
        }, err => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        });
      } else if (result.dismiss) {
        swal('Cancelled', '', 'error');
      }
    });
  }

  approveAll() {
    const ids = [];
    this.requests.forEach(e => {
      if (e.checked) ids.push(e.id);
    });
    if (ids.length > 0) {
      swal({
        title: 'Are you sure?',
        text: 'You will unlock all the unit!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, unlock it!',
        cancelButtonText: 'No, keep it locked.'
      }).then((result) => {
        if (result.value) {
          this.slimLoadingBarService.start();
          const payload = {
            requests_ids: ids
          };
          this.projectsService.approveAllUnitAvailableRequests(payload).subscribe(data => {
            this.getAllRequests();
            this.slimLoadingBarService.complete();
          }, err => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
          });
        } else if (result.dismiss) {
          swal('Cancelled', '', 'error');
        }
      });
    }
  }

  closeModal(modal) {
    modal.close();
  }

  declineAll() {
    const ids = [];
    this.requests.forEach(e => {
      if (e.checked) ids.push(e.id);
    });
    if (ids.length > 0) {
      swal({
        title: 'Are you sure?',
        text: 'You will decline all!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, decline All!',
        cancelButtonText: 'No.'
      }).then((result) => {
        if (result.value) {
          this.slimLoadingBarService.start();
          const payload = {
            requests_ids: ids
          };
          this.projectsService.declineAllUnitAvailableRequests(payload).subscribe(data => {
            this.getAllRequests();
            this.slimLoadingBarService.complete();
          }, err => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
          });
        } else if (result.dismiss) {
          swal('Cancelled', '', 'error');
        }
      });
    }
  }

  viewChanged(ev) {
    if (this.view === 'Availability Requests History') {
      this.getAllRequestsHistory();
    }
  }

  pageChange(event) {
    const arr = this.requests_history.last_page_url.split('?');
    const selectedUrl = `${arr[0]}?page=${event}`;
    // if (this.filterActive) {
    //   this.infiniteWithFilter(selectedUrl, event)
    // } else {
    //   this.infinite(selectedUrl, event);
    // }
    this.infinite(selectedUrl, event);
  }

  infinite(url, event) {
    this.leadsService.infinit(url).subscribe((res: any) => {
      this.requests_history = res;
    }, err => this.errorHandlerService.handleErorr(err));
  }

  exportAvailabilityRequests() {
    this.slimLoadingBarService.start();
    this.projectsService.exportAvailbilityReauests().subscribe((res: any) => {
      this.slimLoadingBarService.complete();
      window.open(res.url);
    }, err => {
      this.slimLoadingBarService.reset();
    });
  }

  exportAvailabilityRequestsHistory() {
    this.slimLoadingBarService.start();
    this.projectsService.exportAvailbilityReauestsHistory().subscribe((res: any) => {
      this.slimLoadingBarService.complete();
      window.open(res.url);
    }, err => {
      this.slimLoadingBarService.reset();
    });
  }
}
