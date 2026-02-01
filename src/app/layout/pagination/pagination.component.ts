import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { UserServiceService } from "../../services/user-service/user-service.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.css"],
})
export class PaginationComponent implements OnInit {
  page_length: number = 15;
  page: number = 1;
  @Input() last_page: number;
  @Input() paginate_url: string;
  @Input() filters: any;
  @Input() to: number;
  @Input() total: number;
  @Output() submitNewRecord: EventEmitter<any> = new EventEmitter();

  constructor(
    private userService: UserServiceService,
    private slimLoadingService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {}

  pageChange(event) {
    this.page = event;
    this.infinite();
  }

  changePageLength(page_length) {
    this.page_length = page_length;
    this.page = 1;
    this.infinite();
  }

  infinite() {
    const params = {
      ...this.filters,
      page: this.page,
      page_length: this.page_length,
    };
    this.slimLoadingService.start();
    this.userService.infinit(this.paginate_url, params).subscribe(
      (res: any) => {
        this.slimLoadingService.complete();
        this.submitNewRecord.emit(res);
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingService.complete();
      }
    );
  }

  resetFilters() {
    const params = {
      page: this.page,
      page_length: this.page_length,
    };
    this.slimLoadingService.start();
    this.userService.infinit(this.paginate_url, params).subscribe(
      (res: any) => {
        this.slimLoadingService.complete();
        this.submitNewRecord.emit(res);
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingService.complete();
      }
    );
  }
}
