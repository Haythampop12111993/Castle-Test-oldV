import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { UserServiceService } from '../../services/user-service/user-service.service';

@Component({
  selector: 'app-system-version',
  templateUrl: './system-version.component.html',
  styleUrls: ['./system-version.component.css']
})
export class SystemVersionComponent implements OnInit {


  form: FormGroup;
  version: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private fb: FormBuilder,
    private userService: UserServiceService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createform();
    this.getVersion();
  }

  getVersion() {
    this.slimLoadingBarService.start();
    // get data 

    this.userService.getVersion()
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        this.version = res;
        this.form.patchValue({version: this.version});

      }, err => {
        this.slimLoadingBarService.reset();
        // this.errorHandlerService.handleErorr(err);
      });
  }

  createform() {
    this.form = this.fb.group({
      version: ['', Validators.required]
    });
  
  }

  saveVersion() {
    const payload: any = this.form.value;
    console.log(payload);
    this.slimLoadingBarService.start();
    // save version

    this.userService.saveVersion(payload).subscribe(
      (res: any) => {
        this.createform();
        swal('version saved successfully', '', 'success');
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }

}
