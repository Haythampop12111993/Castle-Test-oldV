import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { LegalContractArchivesService } from "../../../services/legal-contract-archives.service";

@Component({
  selector: "app-contract-archive-files-table",
  templateUrl: "./contract-archive-files-table.component.html",
  styleUrls: ["./contract-archive-files-table.component.css"],
})
export class ContractArchiveFilesTableComponent implements OnInit {
  @Input() type_id;
  @Input() files;
  @Output() reload = new EventEmitter();

  constructor(
    private router: Router,
    private legalContractArchivesService: LegalContractArchivesService
  ) {}

  ngOnInit() {}

  deleteContractArchive(id) {
    this.legalContractArchivesService
      .deleteContractArchive(id)
      .subscribe((data: any) => {
        this.reload.emit();
      });
  }

  openForm(id?) {
    if (id) {
      this.router.navigate(
        ["/", "pages", "legal-affairs", "contract-archives", "edit", id],
        {
          queryParams: {
            folder_id: this.type_id,
          },
        }
      );
    } else {
      this.router.navigate(
        ["/", "pages", "legal-affairs", "contract-archives", "add"],
        {
          queryParams: {
            folder_id: this.type_id,
          },
        }
      );
    }
  }
}
