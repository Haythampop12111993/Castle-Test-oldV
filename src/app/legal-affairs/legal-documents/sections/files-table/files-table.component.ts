import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { LegalDocumentsService } from "../../../services/legal-documents.service";

@Component({
  selector: "app-files-table",
  templateUrl: "./files-table.component.html",
  styleUrls: ["./files-table.component.css"],
})
export class FilesTableComponent implements OnInit {
  @Input() type_id;
  @Input() files;
  @Output() reload = new EventEmitter();

  constructor(
    private router: Router,
    private legalDocumentsService: LegalDocumentsService
  ) {}

  ngOnInit() {}

  deleteDocument(id) {
    this.legalDocumentsService.deleteDocument(id).subscribe((data: any) => {
      this.reload.emit();
    });
  }

  openForm(id?) {
    if (id) {
      this.router.navigate(
        ["/", "pages", "legal-affairs", "documents", "edit", id],
        {
          queryParams: {
            folder_id: this.type_id,
          },
        }
      );
    } else {
      this.router.navigate(
        ["/", "pages", "legal-affairs", "documents", "add"],
        {
          queryParams: {
            folder_id: this.type_id,
          },
        }
      );
    }
  }
}
