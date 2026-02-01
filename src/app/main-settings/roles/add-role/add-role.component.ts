import { RolesService } from './../roles.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent implements OnInit, OnDestroy {
  //#region Definitions

  roleObj: any = {};
  selectedPermissions: any = [];
  roleId: any;
  role: any = {};
  cloned: boolean = false;
  passedModules: any = [];
  hasPermissionError: boolean = false;
  //#endregion

  constructor(private roleSer: RolesService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getParams();
    this.getQParams();
  }

  getParams() {
    this.route.params.subscribe((res) => {
      if (res.id) {
        this.roleId = +res.id;
        this.getRole();
      }
    });
  }

  getQParams() {
    this.route.queryParams.subscribe((res) => {
      if (res.cloned) {
        this.cloned = res.cloned ? true : false;
      }
    });
  }

  async getRole() {
    // await this.roleSer.getRole(this.roleId).subscribe(
    //   (res: any) => {
    //     this.roleSer.setCurrentRole(res);
    //     this.roleObj = res;
    //   },
    //   (err) => {
    //     console.log('error');
    //   }
    // );
  }

  submit() {
    // check if has permissions error
    if (this.checkPermissionDependancies()) return;
    if (this.roleId && !this.cloned) {
      this.bindInEditData();
      this.roleSer.editRole(this.roleId, this.roleObj).subscribe(
        (res: any) => {
          if (res.message) {
            // Swal.fire('Success', 'Saved successfully', 'success');
            this.router.navigateByUrl(`/dashboard/settings/roles`);
          }
        },
        (err) => {
          console.log('error');
        }
      );
    } else {
      this.roleSer.saveRole(this.roleObj).subscribe(
        (res: any) => {
          if (res.message) {
            // Swal.fire('Success', 'Saved successfully', 'success');
            this.router.navigateByUrl(`/dashboard/settings/roles`);
          }
        },
        (err) => {
          console.log('error');
        }
      );
    }
  }

  checkPermissionDependancies() {
    if (this.passedModules && this.passedModules.length > 0) {
      let related = this.passedModules.filter(
        (a) => a.permissions.filter((b) => b.isParent && !b.isChecked).length > 0
      );
      this.hasPermissionError = related && related.length > 0 ? true : false;
      if (this.hasPermissionError) {
        // Swal.fire('Error', 'There are errors in selected permissions, fix them first !', 'error');
        return true;
      }
    }
    return false;
  }

  choosePermissions(data) {
    if (this.selectedPermissions.some((a) => data.selectedPermissions.includes(a))) {
      // if(this.selectedPermissions.some(a=> data.selectedPermissions.includes(a)) && !data.isEdit) {
      this.selectedPermissions = [...this.selectedPermissions.filter((a) => !data.selectedPermissions.includes(a))];
    } else {
      if (data.selectedPermissions && data.selectedPermissions.length > 0)
        this.selectedPermissions.push(...data.selectedPermissions);
    }

    this.roleObj['permissions'] = this.selectedPermissions;
    this.passedModules = data.modules;
  }

  bindMetaObj(metaObj) {
    this.roleObj = { ...this.roleObj, ...metaObj };
  }

  bindInEditData() {
    if (!this.roleObj.permissions || this.roleObj.permissions.length == 0) {
      let permissions = this.roleObj.modules.map((a) => a.permissions.map((b) => b.name));
      this.roleObj['permissions'] = [].concat.apply([], permissions);
    }

    // if(this.roleObj.level == 0 && (this.roleObj['is_ignore_level'] ))
    //   this.roleObj['is_ignore_level'] = 1 ;
    // if(!this.roleObj['upper_role_id'] )
    //   this.roleObj['upper_role_id'] = this.roleObj.level;
  }

  ngOnDestroy(): void {
    this.roleSer.setCurrentRole(null);
  }
}
