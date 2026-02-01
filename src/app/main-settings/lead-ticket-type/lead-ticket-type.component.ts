import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import swal from "sweetalert2";
import { LeadTicketTypesService } from "../../services/lead-service/lead-ticket-types.service";

@Component({
  selector: "app-lead-ticket-type",
  templateUrl: "./lead-ticket-type.component.html",
  styleUrls: ["./lead-ticket-type.component.css"],
})
export class LeadTicketTypeComponent implements OnInit {
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
  current_selected_type: any;

  constructor(
    private leadTicketTypesService: LeadTicketTypesService,
    private errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit() {
    this.fetchTypes();
  }

  fetchTypes() {
    this.leadTicketTypesService
      .getTicketTypesList(this.page_data.payload)
      .subscribe(
        (data: any) => {
          this.page_data.data = data.data;
          this.page_data.meta.total_pages = data.last_page;
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
  }

  pageChange(page) {
    this.fetchTypes();
  }

  // actions
  editAction(campaign) {
    this.current_selected_type = campaign;
    this.form_data.name = this.current_selected_type.name;
  }

  deleteAction(id) {
    this.leadTicketTypesService.deleteTicketType(id).subscribe(
      (data: any) => {
        swal("Type deleted successfully", "", "success");
        this.fetchTypes();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  saveForm() {
    const campaignData = {
      name: this.form_data.name,
    };
    let request;
    if (this.current_selected_type) {
      request = this.leadTicketTypesService.updateTicketType(
        this.current_selected_type.id,
        campaignData
      );
    } else {
      request = this.leadTicketTypesService.createTicketType(campaignData);
    }

    request.subscribe(
      (data: any) => {
        this.fetchTypes();
        this.resetForm();
        swal(
          `Type ${
            this.current_selected_type ? "updated" : "added"
          } successfully`,
          "",
          "success"
        );
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  resetForm() {
    this.current_selected_type = undefined;
    this.form_data.name = "";
  }
}
