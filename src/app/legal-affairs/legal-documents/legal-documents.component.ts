import { ActivatedRoute, Router } from "@angular/router";
import { LegalDocumentsService } from "./../services/legal-documents.service";
import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";

@Component({
  selector: "app-legal-documents",
  templateUrl: "./legal-documents.component.html",
  styleUrls: ["./legal-documents.component.css"],
})
export class LegalDocumentsComponent implements OnInit {
  type_id;
  type;
  data = {
    types: [],
    files: [],
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private legalDocumentsService: LegalDocumentsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params.type_id) {
        this.type_id = params.type_id;
      } else {
        this.type_id = undefined;
      }
      this.fetchAllData();
    });
  }

  fetchAllData() {
    this.fetchTypes();
    if (this.type_id) {
      this.fetchParent();
      this.fetchDocuments();
    }
  }

  fetchParent() {
    this.legalDocumentsService
      .getDocumentType(this.type_id)
      .subscribe((data: any) => {
        this.type = data;
      });
  }

  fetchTypes() {
    this.legalDocumentsService
      .getDocumentTypes({ parent_id: this.type_id })
      .subscribe((data: any) => {
        this.data.types = data;
      });
  }

  fetchDocuments() {
    this.legalDocumentsService
      .getDocuments({ type_id: this.type_id })
      .subscribe((data: any) => {
        this.data.files = data;
      });
  }

  // actions
  backType() {
    if (this.type.parent_id) {
      this.type_id = this.type.parent_id;
    } else {
      this.type_id = undefined;
    }
    this.openType(this.type_id);
  }

  openType(id) {
    if (id) {
      this.router.navigate(["/", "pages", "legal-affairs", "documents", id]);
    } else {
      this.router.navigate(["/", "pages", "legal-affairs", "documents"]);
    }
  }

  deleteType(id) {
    swal({
      title: "Are you sure?",
      text: "You will add delete it!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No. keep it"
    }).then(result => {
      if (result.value) {
        this.legalDocumentsService.deleteDocumentType(id).subscribe((data: any) => {
          this.fetchTypes();
        });
      }
    });
  }

  openFile() {}
}
