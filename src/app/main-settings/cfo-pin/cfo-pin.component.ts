import { Component, OnInit } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';

import { UserServiceService } from '../../services/user-service/user-service.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';

@Component({
  selector: 'app-cfo-pin',
  templateUrl: './cfo-pin.component.html',
  styleUrls: ['./cfo-pin.component.css']
})
export class CfoPinComponent implements OnInit {
  pin_details: any;

  pin_last_value: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private userService: UserServiceService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.getPinCode();
  }

  getPinCode() {
    this.slimLoadingBarService.start();
    this.userService.getPincode().subscribe(
      data => {
        this.pin_details = data;
        this.pin_details.edit_mode = false;
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  edit_pin() {
    this.pin_last_value = this.pin_details.value;
    this.pin_details.edit_mode = true;
  }

  save_pin() {
    if (this.pin_last_value == this.pin_details.value) {
      this.pin_details.edit_mode = false;
    } else if (this.pin_details.value.length < 4) {
      swal('Pin must be at least 4 digit', '', 'error');
    } else {
      const data = {
        pin_code: this.pin_details.value
      };
      this.slimLoadingBarService.start();
      this.userService.changePinCode(data).subscribe(
        reso => {
          this.getPinCode();
          swal('Pin code changes successfully', '', 'success');
        },
        err => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }
}
