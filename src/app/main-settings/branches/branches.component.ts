import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { BranchService } from '../../services/branch/branch.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  branches: any[] = [];

  constructor(
    private router: Router,
    private slimLoadingBarService: SlimLoadingBarService,
    private branchService: BranchService,
    public errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.getBranches();
  }

  getBranches() {
    this.slimLoadingBarService.start();
    this.branchService.getAllBranches().subscribe(
      (res: any) => {
        this.branches = res.data;
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  edit(id) {
    this.router.navigate(['/pages/settings/branches/add/', id]);
  }
}
