import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { environment } from "../../../environments/environment";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { ColdCallsService } from "../cold-calls.service";
import { ErrorHandlerService } from "./../../services/shared/error-handler.service";

@Component({
  selector: "app-all-data",
  templateUrl: "./all-data.component.html",
  styleUrls: ["./all-data.component.scss"],
})
export class AllDataComponent implements OnInit {
  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  contactsElements: any[];
  searchText: string = "";
  contactsRaw: any;
  currentPage: any = 0;
  is_loading: boolean = false;

  searchKeyword = "";
  importForm: FormGroup;
  sheet;
  @ViewChild("inputFile") myInputVariable: ElementRef;

  constructor(
    private coldCallsService: ColdCallsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private leadsService: LeadsService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAllContactData();
    this.iniImportForm();
  }

  fetchAllContactData(searchKeyword?, page?) {
    if (searchKeyword) {
      this.searchKeyword = searchKeyword = searchKeyword.trim();
    }

    this.slimLoadingBarService.start();
    this.coldCallsService
      .getAllContactData(searchKeyword, page)
      .subscribe(
        (res: any) => {
          this.contactsRaw = res;
          this.contactsElements = res.data;
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.slimLoadingBarService.complete();
      });
  }

  pageChange(page) {
    this.fetchAllContactData(this.searchKeyword, page);
  }

  deleteFile(id) {
    if (id) {
      swal({
        title: "Are you sure?",
        text: "You want to be delete this file!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No.",
      }).then(async (result) => {
        if (result.value) {
          this.coldCallsService.deleteContactDataCard(id).subscribe(
            (res: any) => {
              if (res.message == "Success") {
                swal("Success", "Deleted successfully", "success");
                this.fetchAllContactData();
              }
            },
            (err) => {
              this.errorHandlerService.handleErorr(err);
            }
          );
        }
      });
    } else {
      swal("Error", "Select File", "error");
    }
  }

  //import calls
  iniImportForm() {
    this.importForm = this.fb.group({
      name: ["", Validators.required],
    });
  }

  handleImportedFile(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.sheet = {
          filename: file.name,
          file: (reader.result as any as any).split(",")[1],
        };
      };
    }
  }

  async importSubmit() {
    let payload = this.importForm.value;
    Object.assign(payload, this.sheet);

    this.is_loading = true;

    this.coldCallsService.importFile(payload).subscribe(
      (res: any) => {
        this.is_loading = false;
        if (res.message) {
          this.fetchAllContactData();
          this.myInputVariable.nativeElement.value = "";
          this.importForm.reset();

          swal("Success", "imported successfully", "success");
        } else {
          swal("Success", res.message, "success").then((result) => {
            if (result.value) {
              window.open(res.url);
            }
          });
        }
      },
      (err) => {
        this.is_loading = false;
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  exportDemo() {
    window.open(
      `${environment.api_raw_base_url}uploads/documents/contacts_data/import_cold_calls.xlsx`
    );
  }

  export(cardf_id) {
    let payload = {
      card_id: cardf_id,
    };
    this.coldCallsService.exportExcel(payload).subscribe(
      (res: any) => {
        window.open(res.url);
      },
      (err) => {
        swal("Failed", "Download example failed", "error");
      }
    );
  }
}
