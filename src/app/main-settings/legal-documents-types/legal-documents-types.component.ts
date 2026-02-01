import { LegalDocumentsService } from "./../../legal-affairs/services/legal-documents.service";
import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import swal from "sweetalert2";

@Component({
  selector: "app-legal-documents-types",
  templateUrl: "./legal-documents-types.component.html",
  styleUrls: ["./legal-documents-types.component.css"],
})
export class LegalDocumentsTypesComponent implements OnInit {
  add_type: any;

  types: any[];

  current_selected_type: any;

  constructor(
    private legalDocumentsService: LegalDocumentsService,
    private errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit() {
    this.getAllTypes();
  }

  addType() {
    const typeData = {
      name: this.add_type,
    };
    this.legalDocumentsService.postDocumentType(typeData).subscribe(
      (data: any) => {
        this.getAllTypes();
        this.add_type = "";
        swal("Type added successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  deleteType(id) {
    this.legalDocumentsService.deleteDocumentType(id).subscribe(
      (data: any) => {
        swal("Type deleted successfully", "", "success");
        this.getAllTypes();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getAllTypes(page?) {
    this.legalDocumentsService.getDocumentTypes(page).subscribe(
      (data: any) => {
        this.types = data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  editType(type) {
    this.current_selected_type = type;
    this.add_type = this.current_selected_type.name;
  }

  updateType() {
    const typeData = {
      name: this.add_type,
    };
    this.legalDocumentsService
      .updateDocumentType(this.current_selected_type.id, typeData)
      .subscribe(
        (res: any) => {
          this.current_selected_type = undefined;
          this.add_type = "";
          this.getAllTypes();

          swal("Success", "Edited Type successfully", "success");
        },
        (err) => {
          console.log(err);
        }
      );
  }

  cancelUpdate() {
    this.current_selected_type = undefined;
  }
}
