import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { LegalContractArchivesService } from "../services/legal-contract-archives.service";

@Component({
  selector: "app-legal-contract-archive",
  templateUrl: "./legal-contract-archive.component.html",
  styleUrls: ["./legal-contract-archive.component.css"],
})
export class LegalContractArchiveComponent implements OnInit {
  type_id;
  type;
  data = {
    types: [],
    files: [],
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private legalContractArchivesService: LegalContractArchivesService
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
      this.fetchContractArchives();
    }
  }

  fetchParent() {
    this.legalContractArchivesService
      .getContractArchiveType(this.type_id)
      .subscribe((data: any) => {
        this.type = data;
      });
  }

  fetchTypes() {
    this.legalContractArchivesService
      .getContractArchiveTypes({ parent_id: this.type_id })
      .subscribe((data: any) => {
        this.data.types = data;
      });
  }

  fetchContractArchives() {
    this.legalContractArchivesService
      .getContractArchives({ type_id: this.type_id })
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
      this.router.navigate([
        "/",
        "pages",
        "legal-affairs",
        "contract-archives",
        id,
      ]);
    } else {
      this.router.navigate([
        "/",
        "pages",
        "legal-affairs",
        "contract-archives",
      ]);
    }
  }

  deleteType(id) {
    swal({
      title: "Are you sure?",
      text: "You will add delete it!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No. keep it",
    }).then((result) => {
      if (result.value) {
        this.legalContractArchivesService
          .deleteContractArchiveType(id)
          .subscribe((data: any) => {
            this.fetchTypes();
          });
      }
    });
  }

  openFile() {}
}
