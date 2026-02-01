import { Department } from "./../../../models/department";
import { Ticket } from "./../../../models/ticket";
import { FormControl } from "@angular/forms";
import { HelpdeskService } from "./../../../services/helpdesk/helpdesk.service";
import { EmbededModal } from "./../../../interfaces/embededModal";
import swal from "sweetalert2";
import { ErrorHandlerService } from "./../../../services/shared/error-handler.service";
import { ProjectsService } from "./../../../services/projects/projects.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  ElementRef,
} from "@angular/core";
import { Modal } from "ngx-modal";

@Component({
  selector: "app-assign-ticket-modal",
  templateUrl: "./assign-ticket-modal.component.html",
  styleUrls: ["./assign-ticket-modal.component.css"],
})
export class AssignTicketModalComponent implements OnInit, EmbededModal {
  @ViewChild("modal") private modal: Modal;
  @ViewChild("assignTicketFileInput") private assignTicketFileInput: ElementRef;
  @Input() department_id;
  @Input() user_id;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  ticket_details: Ticket;
  private users: any[];
  filteredUsers: any[];
  departments: Department[];
  time_to_actions = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];
  // department_id: FormControl = new FormControl(null);
  assignTicket: any = {
    time_to_next_action: null,
    assign_to: null,
    department_id: null,
    feedback: {
      description: null,
      attachments: [],
    },
  };
  userProfile: any = JSON.parse(localStorage.getItem("userProfile"));
  user: any = {};
  role: any = window.localStorage.getItem("role");
  notSupervisor: boolean = false;

  constructor(
    private helpDeskService: HelpdeskService,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.getUsers();
    this.getDepartments();

    // this.department_id.valueChanges.subscribe(
    //   (selectedDepId)=>{
    //     this.filteredUsers =  this.users.filter((user)=>user.department_id == selectedDepId);
    //   }
    // )
    this.checkIsSupervisor();
  }

  ngOnChanges(): void {
    if(this.department_id) {
      this.assignTicket.department_id = this.department_id;
      this.users && this.selectDepartment(this.assignTicket.department_id);
    }
    if(this.user_id) {
      this.assignTicket.assign_to = this.user_id;
    }
  }

  checkIsSupervisor() {
    console.log(this.userProfile);
    if (
      this.userProfile.role != "Helpdesk Supervisor" &&
      this.userProfile.role != "Helpdesk Agent" &&
      this.userProfile.role != "Legal and Technical" &&
      this.userProfile.role != "Admin" &&
      this.userProfile.role != "Super Development"
    ) {
      this.notSupervisor = true;
      this.user = JSON.parse(this.userProfile);
      this.department_id.setValue(this.user.department.id);
    }
  }

  open(ticket) {
    this.modal.open();
    this.ticket_details = ticket;
  }

  submitAssignTicketModal(modal) {
    if (!this.isFormValid()) {
      swal("Form incomplete", "Please fill required fields", "info");
      return;
    }
    let payload = this.assignTicket;
    payload.time_to_next_action = +payload.time_to_next_action * 24;
    this.slimLoadingBarService.start();
    this.helpDeskService
      .assignTicketToAgent(this.ticket_details.id, this.assignTicket)
      .subscribe(
        (res: any) => {
          this.onSubmit.emit({ success: true, action: "tickets" });
          swal("Success", "Assigned Ticket Successfully", "success");
          modal.close();
          this.slimLoadingBarService.complete();
          this.resetFields();
        },
        (err) => {
          this.slimLoadingBarService.complete();
          this.errorHandlerService.handleErorr(err);
          this.onSubmit.emit(false);
        }
      );
  }

  async onAssignToAgenFilesChange(event) {
    let selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      let file = selectedFiles[i];
      let reader = new FileReader();
      await reader.readAsDataURL(file);
      reader.onload = async () => {
        let attach = {
          name: file.name,
          type: file.type,
          src: (reader.result as any as any).split(",")[1],
        };
        await this.assignTicket.feedback.attachments.push(attach);
      };
      console.log(this.assignTicket.feedback);
    }
  }

  getUsers() {
    // to do replace this api with api that have all the users in the system
    this.slimLoadingBarService.start();
    this.helpDeskService.getsUsersToAssignTicket().subscribe(
      (res: any) => {
        this.users = res;
        if (this.notSupervisor) {
          this.filteredUsers = this.users.filter(
            (user) => user.department_id == this.user.department.id
          );
        }
      this.department_id && this.selectDepartment(this.assignTicket.department_id);
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getDepartments() {
    this.slimLoadingBarService.start();
    this.helpDeskService.getDepartments().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.departments = res;
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  selectDepartment(e) {
    console.log("dept selected: ", this.department_id.value, e);
    this.filteredUsers = this.users.filter(
      (user) => user.department_id == e
    );
  }

  private resetFields() {
    // this.department_id.reset();
    this.assignTicketFileInput.nativeElement.value = "";
    this.assignTicket = {
      time_to_next_action: null,
      assign_to: null,
      department_id: null,
      feedback: {
        description: null,
        attachments: [],
      },
    };
  }

  isFormValid(): boolean {
    if (!this.assignTicket.department_id) {
      return false
    } else {
      return true;
    }
  }
}
