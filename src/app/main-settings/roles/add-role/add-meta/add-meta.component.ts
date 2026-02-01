import { RolesService } from './../../roles.service';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-meta',
  templateUrl: './add-meta.component.html',
  styleUrls: ['./add-meta.component.scss'],
})
export class AddMetaComponent implements OnInit {
  //#region Definitions
  form: FormGroup;
  roleName: any = '';
  isIgnored: boolean = false;
  scopesClicked: boolean = false;
  allRoles: any = [];
  currentRoles = [];
  currentOrderedRoles = [];
  ignoreRoles = [];
  selectedPosition: any = '';
  selectedPositionId: any = '';
  dataObj: any = {};
  @Output() formObj = new EventEmitter<any>();
  role: any = {};
  @Input() cloned: boolean;

  //#endregion

  constructor(private formBuilder: FormBuilder, private rolesService: RolesService) {}

  ngOnInit(): void {
    this.initData();
    // this.createForm();
  }

  initData() {
    this.listenCurrentRole();
    this.getRoles();
  }

  createForm(data?: any) {
    console.log(data);
    if (data) {
      this.form = this.formBuilder.group({
        name: ['', Validators.required],
        current_roles: [''],
        ignore_level_roles: [''],
        ignore_level: [''],
        compaigns: [''],
        projects: [''],
      });
    } else {
      this.form = this.formBuilder.group({
        name: ['', Validators.required],
        current_roles: [''],
        ignore_level_roles: [''],
        ignore_level: [''],
        compaigns: [''],
        projects: [''],
      });
    }
  }

  getRoles() {
    this.allRoles = [
      {
          "id": 1,
          "name": "admin",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 1,
          "upper_role_id": 7
      },
      {
          "id": 2,
          "name": "CEO",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 3,
          "upper_role_id": 17
      },
      {
          "id": 3,
          "name": "sales_director",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 5,
          "upper_role_id": 4
      },
      {
          "id": 4,
          "name": "team_leader",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 4,
          "upper_role_id": 2
      },
      {
          "id": 5,
          "name": "sales_agent",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 8,
          "upper_role_id": 19
      },
      {
          "id": 6,
          "name": "sales_manager",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 6,
          "upper_role_id": 3
      },
      {
          "id": 7,
          "name": "test role",
          "guard_name": "api",
          "created_at": "2021-06-24T12:41:34.000000Z",
          "updated_at": "2021-06-24T12:41:34.000000Z",
          "level": 0,
          "upper_role_id": 1
      },
      {
          "id": 17,
          "name": "CEO Test",
          "guard_name": "api",
          "created_at": "2021-07-13T09:48:31.000000Z",
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 2,
          "upper_role_id": 1
      },
      {
          "id": 19,
          "name": "team_leader_test",
          "guard_name": "api",
          "created_at": "2021-07-13T10:52:31.000000Z",
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 7,
          "upper_role_id": 6
      },
      {
          "id": 20,
          "name": "adminx",
          "guard_name": "api",
          "created_at": "2021-07-13T12:36:39.000000Z",
          "updated_at": "2021-07-13T12:36:39.000000Z",
          "level": 0,
          "upper_role_id": 1
      },
      {
          "id": 22,
          "name": "call center",
          "guard_name": "api",
          "created_at": "2021-07-28T13:38:03.000000Z",
          "updated_at": "2021-07-28T13:38:03.000000Z",
          "level": 0,
          "upper_role_id": 1
      },
      {
          "id": 23,
          "name": "accoutant",
          "guard_name": "api",
          "created_at": "2021-11-03T14:51:50.000000Z",
          "updated_at": "2021-11-03T14:51:50.000000Z",
          "level": 0,
          "upper_role_id": 1
      },
      {
          "id": 24,
          "name": "super admin test role",
          "guard_name": "api",
          "created_at": "2021-11-10T13:28:56.000000Z",
          "updated_at": "2021-11-10T13:28:56.000000Z",
          "level": 0,
          "upper_role_id": 1
      }
    ];
    this.filterRoles();

    // this.rolesService.getRoles().subscribe(
    //   (res) => {
    //     if (res) {
    //       this.allRoles = res;
    //       this.filterRoles();
    //     }
    //   },
    //   (err) => {
    //     console.log('error');
    //   }
    // );
  }

  async listenCurrentRole() {
    await this.rolesService.role$.subscribe((res) => {
      if (res) {
        this.role = res || {};
        this.bindCurrentRole();
        this.currentOrderedRoles = this.cloned
          ? this.currentRoles.sort((a, b) => (a.level > b.level ? 1 : -1))
          : this.currentRoles.filter((a) => a.id != this.role.id).sort((a, b) => (a.level > b.level ? 1 : -1));
      }
    });
  }

  bindCurrentRole() {
    if (Object.keys(this.role).length > 0) {
      this.roleName = this.role.name;
      // this.selectedPosition = this.role.level > 1 ? this.role.level: '';
      this.isIgnored = this.role.level == 0 ? true : false;
      if (!this.isIgnored && !this.cloned) this.bindPositionInEdit();
    }
  }

  onChangePosition(pos_id) {
    this.selectedPosition = pos_id ? this.currentRoles.find((a) => a.id == pos_id).level + 1 : '';
    this.dataObj['upper_role_id'] = pos_id || 1;
    this.formObj.emit(this.dataObj);
  }

  bindPositionInEdit() {
    if (this.currentRoles && this.currentRoles.length > 0) {
      this.selectedPosition = '';
      this.selectedPositionId = '';
      let upper_role = this.currentRoles.find((a) => a.id == this.role.upper_role_id);
      this.selectedPosition = upper_role.level + 1;
      this.selectedPositionId = upper_role.id;
      this.dataObj['upper_role_id'] = this.role.upper_role_id;
      this.formObj.emit(this.dataObj);
    }
  }

  changeData() {
    this.dataObj['name'] = this.roleName;
    this.dataObj['is_ignore_level'] = this.isIgnored ? 1 : 0;
    if (!this.dataObj['upper_role_id']) this.dataObj['upper_role_id'] = 1;
    this.formObj.emit(this.dataObj);
  }

  clickScope(flag) {
    this.scopesClicked = !this.scopesClicked;
    // switch (flag) {
    //   case 'campaign':

    //     break;
    //   case 'projects':

    //     break;

    //   default:
    //     break;
    // }
  }

  filterRoles() {
    this.currentRoles = this.allRoles.filter((a) => a.level != 0);
    this.currentOrderedRoles = this.currentRoles.sort((a, b) => (a.level > b.level ? 1 : -1));
    this.ignoreRoles = this.allRoles.filter((a) => a.level == 0);
  }
}
