import { ErrorHandlerService } from './../../services/shared/error-handler.service';
import { HelpdeskService } from './../../services/helpdesk/helpdesk.service';
import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

@Component({
  selector: "app-add-ticket-settings",
  templateUrl: "./add-ticket-settings.component.html",
  styleUrls: ["./add-ticket-settings.component.css"],
})
export class AddTicketSettingsComponent implements OnInit {
  tabs: any = [
    {
      name: "Ticket Type",
      active: true,
    },
    {
      name: "Ticket Source",
      active: false,
    },
    {
      name: "Ticket Priority",
      active: false,
    },
    {
      name: "Ticket Status",
      active: false,
    },
    {
      name: "Ticket Client Request",
      active: false,
    },
  ];

  active_tab: any = this.tabs[0].name;

  name: any = "";
  names: any;
  types: any;
  statuses: any;
  clientRequests: any;
  sources: any;
  priorites: any;
  isEdit: boolean = false;
  nameObj = {};

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private helpdeskService: HelpdeskService,
    private errorService: ErrorHandlerService,
  ) {}

  ngOnInit() {
    this.getTicketTypes();
    this.getTicketStatus();
    this.getTicketClientRequests();
    this.getTicketSource();
    this.getTicketPriority();
  }

  getTicketTypes() {
    this.slimLoadingBarService.start();
    this.helpdeskService.getTicketTypes().subscribe(
      (res: any) => {
        this.types = res;
        this.names = res;
        this.slimLoadingBarService.complete();
        // this.ticketTypes
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  getTicketSource() {
    this.helpdeskService.getTicketSource().subscribe(
      (res: any) => {
        this.sources = res;
        if (this.active_tab == 'Ticket Source') {
          this.names = res;
        }
      },
      (err) => {}
    );
  }

  getTicketPriority() {
    this.helpdeskService.getTicketPriority().subscribe(
      (res: any) => {
        this.priorites = res;
        if (this.active_tab == 'Ticket Priority') {
          this.names = res;
        }
      },
      (err) => {}
    );
  }

  getTicketStatus() {
    this.helpdeskService.getTicketStatus().subscribe(
      (res: any) => {
        this.statuses = res;
        if (this.active_tab == 'Ticket Status') {
          this.names = res;
        }
      },
      (err) => {}
    );
  }

  getTicketClientRequests() {
    this.helpdeskService.getTicketClientRequests().subscribe(
      (res: any) => {
        this.clientRequests = res;
        if (this.active_tab == 'Ticket Client Request') {
          this.names = res;
        }
      },
      (err) => {}
    );
  }

  setActiveTab(tab, index) {
    this.tabs.forEach((group) => {
      group.active = false;
    });
    this.name = "";
    this.names = null;
    this.setTableView(tab.name);
    this.active_tab = tab.name;
    this.tabs[index].active = true;
  }

  setTableView(tabName) {
    switch (tabName) {
      case 'Ticket Type':
        this.names = this.types;
        break;
      case 'Ticket Source':
        this.names = this.sources;
        break;
      case 'Ticket Priority':
        this.names = this.priorites;
        break;
      case 'Ticket Status':
        this.names = this.statuses;
        break;
      case 'Ticket Client Request':
        this.names = this.clientRequests;
        break;
      default:
        break;
    }
  }

  addName(tab) {
    switch (tab.name) {
      case "Ticket Type":
        this.addTicketType();
        break;
      case "Ticket Source":
        this.addTicketSource();
        break;
      case "Ticket Priority":
        this.addTicketPriority();
        break;
      case "Ticket Status":
        this.addTicketStatus();
        break;
      case "Ticket Client Request":
        this.addTicketClientRequests();
        break;
      default:
        break;
    }
  }

  deleteName(tab, id, index) {
    switch (tab.name) {
      case "Ticket Type":
        this.deleteTicketType(id);
        break;
      case "Ticket Source":
        this.deleteTicketSource(id);
        break;
      case "Ticket Priority":
        this.deleteTicketPriority(id);
        break;
      case "Ticket Status":
        this.deleteTicketStatus(id);
        break;
        case "Ticket Client Request":
          this.deleteTicketClientRequests(id);
          break;
      default:
        break;
    }
  }

  deleteTicketType(id) {
    this.slimLoadingBarService.start();
    this.helpdeskService.deleteTicketTypes(id)
      .subscribe((res: any) => {
        this.getTicketTypes();
        swal('Success', 'Deleted Ticket Type Successfully', 'success');
        this.slimLoadingBarService.complete();
      }, err => {
        this.slimLoadingBarService.reset();
        this.errorService.handleErorr(err);
      });
  }

  deleteTicketSource(id) {
    this.slimLoadingBarService.start();
    this.helpdeskService.deleteTicketSource(id)
      .subscribe((res: any) => {
        this.getTicketSource();
        swal('Success', 'Deleted Ticket Source Successfully', 'success');
        this.slimLoadingBarService.complete();
      }, err => {
        this.slimLoadingBarService.reset();
        this.errorService.handleErorr(err);

      });
  }

  deleteTicketPriority(id) {
    this.slimLoadingBarService.start();
    this.helpdeskService.deleteTicketPriority(id)
      .subscribe((res: any) => {
        this.getTicketPriority();
        swal('Success', 'Deleted Ticket Priority Successfully', 'success');
        this.slimLoadingBarService.complete();
      }, err => {
        this.slimLoadingBarService.reset();
        this.errorService.handleErorr(err);
      });
  }

  deleteTicketStatus(id) {
    this.slimLoadingBarService.start();
    this.helpdeskService.deleteTicketStatus(id)
      .subscribe((res: any) => {
        this.getTicketStatus();
        swal('Success', 'Deleted Ticket Status Successfully', 'success');
        this.slimLoadingBarService.complete();
      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  deleteTicketClientRequests(id) {
    this.slimLoadingBarService.start();
    this.helpdeskService.deleteTicketClientRequests(id)
      .subscribe((res: any) => {
        this.getTicketClientRequests();
        swal('Success', 'Deleted Ticket Status Successfully', 'success');
        this.slimLoadingBarService.complete();
      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  addTicketType() {
    let payload = {
      name: this.name
    };
    this.slimLoadingBarService.start();
    this.helpdeskService.addTicketTypes(payload)
      .subscribe((res: any) => {
        this.name = '';
        this.getTicketTypes();
        swal('Success', 'Added Ticket Type', 'success');
        this.slimLoadingBarService.complete();
      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  addTicketSource() {
    let payload = {
      name: this.name
    };
    this.slimLoadingBarService.start();
    this.helpdeskService.addTicketSource(payload)
      .subscribe((res: any) => {
        this.name = '';
        this.getTicketSource();
        swal('Success', 'Added Ticket Source', 'success');
        this.slimLoadingBarService.complete();
      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  addTicketPriority() {
    let payload = {
      name: this.name
    };
    this.slimLoadingBarService.start();
    this.helpdeskService.addTicketPriority(payload)
      .subscribe((res: any) => {
        this.name = '';
        this.getTicketPriority();
        swal('Success', 'Added Ticket Priority', 'success');
        this.slimLoadingBarService.complete();
      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  addTicketStatus() {
    let payload = {
      name: this.name
    };
    this.slimLoadingBarService.start();
    this.helpdeskService.addTicketStatus(payload)
      .subscribe((res: any) => {
        this.name = '';
        this.getTicketStatus();
        swal('Success', 'Added Ticket Status', 'success');
        this.slimLoadingBarService.complete();
      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  addTicketClientRequests() {
    let payload = {
      name: this.name
    };
    this.slimLoadingBarService.start();
    this.helpdeskService.addTicketClientRequests(payload)
      .subscribe((res: any) => {
        this.name = '';
        this.getTicketClientRequests();
        swal('Success', 'Added Ticket Status', 'success');
        this.slimLoadingBarService.complete();
      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  editName(name){
    this.isEdit = true;
    this.nameObj = name;
    this.name = name.name
  }

  cancelEdit(){
    this.name = '';
    this.nameObj = {};
    this.isEdit = false;
  }

  saveEditName(tab){
    switch (tab.name) {
      case "Ticket Type":
        this.editTicketType(this.nameObj['id']);
        break;
      case "Ticket Source":
        this.editTicketSource(this.nameObj['id']);
        break;
      case "Ticket Priority":
        this.editTicketPriority(this.nameObj['id']);
        break;
      case "Ticket Status":
        this.editTicketStatus(this.nameObj['id']);
        break;
      case "Ticket Client Request":
        this.editTicketClientRequests(this.nameObj['id']);
        break;
      default:
        break;
    }
  }

  editTicketType(id) {
    let payload = {
      name: this.name
    };
    this.slimLoadingBarService.start();
    this.helpdeskService.editTicketTypes(id, payload)
      .subscribe((res: any) => {
        this.name = '';
        this.getTicketTypes();
        swal('Success', 'Saved Ticket Type', 'success');
        this.slimLoadingBarService.complete();
        this.isEdit = false;
      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  editTicketSource(id) {
    let payload = {
      name: this.name
    };
    this.slimLoadingBarService.start();
    this.helpdeskService.editTicketSource(id, payload)
      .subscribe((res: any) => {
        this.name = '';
        this.getTicketSource();
        swal('Success', 'Saved Ticket Source', 'success');
        this.slimLoadingBarService.complete();
        this.isEdit = false;

      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  editTicketPriority(id) {
    let payload = {
      name: this.name
    };
    this.slimLoadingBarService.start();
    this.helpdeskService.editTicketPriority(id, payload)
      .subscribe((res: any) => {
        this.name = '';
        this.getTicketPriority();
        swal('Success', 'Saved Ticket Priority', 'success');
        this.slimLoadingBarService.complete();
        this.isEdit = false;

      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  editTicketStatus(id) {
    let payload = {
      name: this.name
    };
    this.slimLoadingBarService.start();
    this.helpdeskService.editTicketStatus(id, payload)
      .subscribe((res: any) => {
        this.name = '';
        this.getTicketStatus();
        swal('Success', 'Saved Ticket Status', 'success');
        this.slimLoadingBarService.complete();
        this.isEdit = false;

      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  editTicketClientRequests(id) {
    let payload = {
      name: this.name
    };
    this.slimLoadingBarService.start();
    this.helpdeskService.editTicketClientRequests(id, payload)
      .subscribe((res: any) => {
        this.name = '';
        this.getTicketClientRequests();
        swal('Success', 'Saved Ticket Client Request', 'success');
        this.slimLoadingBarService.complete();
        this.isEdit = false;

      }, err => {
        this.errorService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }
}
