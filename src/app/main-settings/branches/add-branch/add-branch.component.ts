import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';

import { BranchService } from '../../../services/branch/branch.service';
import { ErrorHandlerService } from '../../../services/shared/error-handler.service';
import { TeamService } from '../../../services/settings-service/team/team.service';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.css']
})
export class AddBranchComponent implements OnInit {
  is_edit: any;

  page_loaded = false;

  documentForm: FormGroup;

  dropdownList = [];

  id: number;

  selected_teams: any;

  teams: any;

  headOfSales: any;
  selectedHeadOfSales: any[] = [];

  deputyHeadOfSales: any;
  selectedDeputyHeadOfSales: any[] = [];

  salesDirector: any;
  selectedSalesDirector: any[] = [];

  deputySalesDirector: any;
  selectedDeputySalesDirector: any[] = [];


  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    public errorHandlerService: ErrorHandlerService,
    private branchService: BranchService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getRolesData();
    this.getTeams();
    this.id = +this.route.snapshot.params['id'];
    console.log(this.id);
    this.createForm();
    if (this.id == 0) {
      this.is_edit = false;
    } else {
      this.is_edit = true;
      this.createEditForm();
    }
    console.log(this.is_edit);
  }

  getRolesData() {
    this.http.get(`${environment.api_base_url}teams/structure`).subscribe(
      (data: any[]) => {
        this.prepareData(data);
        if (this.is_edit) {
          this.createEditForm();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  prepareData(data: any[]) {
    data.forEach(function (v) {
      v.users.forEach(function (c) {
        delete c.is_sales_team;
      });
    });
    this.headOfSales = data.find(a => a.roleName === 'Head Of Sales')
      ? data.find(a => a.roleName === 'Head Of Sales').users
      : null;
    this.deputyHeadOfSales = data.find(
      a => a.roleName === 'Deputy Head Of Sales'
    )
      ? data.find(a => a.roleName === 'Deputy Head Of Sales').users
      : null;
    this.salesDirector = data.find(a => a.roleName === 'Sales Director')
      ? data.find(a => a.roleName === 'Sales Director').users
      : null;
    this.deputySalesDirector = data.find(
      a => a.roleName === 'Deputy Sales Director'
    )
  }

  createForm() {
    this.documentForm = this.fb.group({
      name: ['', Validators.required],
      teams_ids: [[], Validators.required],
      selectedHeadOfSales: [[]],
      selectedDeputyHeadOfSales: [[]],
      selectedDeputySalesDirector: [[]],
      selectedSalesDirector: [[]],
      branch_color: ['']
    });
    this.page_loaded = true;
  }

  createEditForm() {
    this.slimLoadingBarService.start();
    this.branchService.getBranchDetails(this.id).subscribe(
      (data: any) => {
        this.selected_teams = [];
        const teams = data.teams;
        data.teams.forEach((element, index) => {
          this.selected_teams.push({
            id: element.id,
            itemName: element.name
          });
        });
        this.teams = teams;
        let selectedData = this.handleSelected(data);
        this.documentForm.patchValue({
          name: data.branch_data.name,
          teams_ids: this.selected_teams,
          selectedHeadOfSales: selectedData.selectedHeadOfSales || [],
          selectedDeputyHeadOfSales: selectedData.selectedDeputyHeadOfSales || [],
          selectedSalesDirector: selectedData.selectedSalesDirector || [],
          selectedDeputySalesDirector: selectedData.selectedDeputySalesDirector || [],
          branch_color: data.branch_data.branch_color
        });
        console.log(this.deputyHeadOfSales);
        console.log(this.documentForm.value);
        this.page_loaded = true;
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  handleSelected(data) {
    let selectedHeadOfSales = [];
    let selectedDeputyHeadOfSales = [];
    let selectedSalesDirector = [];
    let selectedDeputySalesDirector = [];
    data.roles['Head Of Sales'].forEach((elm => {
      let item = {
        id: elm.id,
        name: elm.name
      };
      selectedHeadOfSales.push(item);
    }));
    data.roles['Deputy Head Of Sales'].forEach((elm => {
      let item = {
        id: elm.id,
        name: elm.name
      };
      selectedDeputyHeadOfSales.push(item);
    }));
    data.roles['Sales Director'].forEach((elm => {
      let item = {
        id: elm.id,
        name: elm.name
      };
      selectedSalesDirector.push(item);
    }));
    data.roles['Deputy Sales Director'].forEach((elm => {
      let item = {
        id: elm.id,
        name: elm.name
      };
      selectedDeputySalesDirector.push(item);
    }));
    return {
      selectedHeadOfSales, selectedDeputyHeadOfSales, selectedDeputySalesDirector, selectedSalesDirector
    };
  }

  getTeams() {
    this.teams = null;
    this.slimLoadingBarService.start();
    this.teamService.getTeamsParent().subscribe(
      data => {
        this.teams = data;
        this.teams.forEach((e, index) => {
          const newData = {
            id: e.id,
            itemName: e.name
          };
          this.dropdownList.push(newData);
        });
        console.log(this.dropdownList);
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  save() {
    const formModel = this.documentForm.value;
    const teams_ids = [];
    console.log(formModel);
    formModel.teams_ids.forEach(element => {
      teams_ids.push(element.id);
    });
    formModel.teams_ids = teams_ids;
    const selectedDeputyHeadOfSales = [];
    if (formModel.selectedDeputyHeadOfSales) {
      formModel.selectedDeputyHeadOfSales.forEach(element => {
        selectedDeputyHeadOfSales.push(element.id);
      });
    }
    formModel.selectedDeputyHeadOfSales = selectedDeputyHeadOfSales;
    const selectedDeputySalesDirector = [];
    formModel.selectedDeputySalesDirector.forEach(element => {
      selectedDeputySalesDirector.push(element.id);
    });
    formModel.selectedDeputySalesDirector = selectedDeputySalesDirector;
    const selectedHeadOfSales = [];
    formModel.selectedHeadOfSales.forEach(element => {
      selectedHeadOfSales.push(element.id);
    });
    formModel.selectedHeadOfSales = selectedHeadOfSales;
    const selectedSalesDirector = [];
    formModel.selectedSalesDirector.forEach(element => {
      selectedSalesDirector.push(element.id);
    });
    formModel.selectedSalesDirector = selectedSalesDirector;
    console.log(formModel);
    if (this.is_edit) {
      this.slimLoadingBarService.start();
      this.branchService.editBranch(this.id, formModel).subscribe(
        res => {
          swal(`Edited ${formModel.name} branch successfully`, '', 'success');
          this.router.navigate(['/pages/settings/branches']);
          this.createForm();
        },
        err => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    } else {
      this.slimLoadingBarService.start();
      this.branchService.addBranch(formModel).subscribe(
        res => {
          swal(`Created ${formModel.name} branch successfully`, '', 'success');
          this.router.navigate(['/pages/settings/branches']);
          this.createForm();
        },
        err => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  onSubmit(event) {
    event.stopPropagation();
    console.log(`start process of save edits`);
  }

}
