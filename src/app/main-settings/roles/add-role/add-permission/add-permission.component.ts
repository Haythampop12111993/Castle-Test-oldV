import { map } from 'rxjs/operators';
import { Component, EventEmitter, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RolesService } from '../../roles.service';
import { id } from 'date-fns/locale';
import { OnDestroy } from '@angular/core';
// import { SmartFieldSearchOption } from 'src/app/shared/constructs/SmartFieldSearchOption';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss'],
})
export class AddPermissionComponent implements OnInit, OnDestroy {
  //#region Definitions
  permissions: any = [];
  related_permissions: any = [];
  modules: any = [];
  filters: any = [];
  _modules_perms: any = [];
  modules_perms: any = [];
  storedModules: any = [];
  filtered = '';
  @Output() choosePermissions = new EventEmitter<any>();
  role: any = {};
  timerId: any = '';
  //#endregion

  constructor(private formBuilder: FormBuilder, private rolesService: RolesService) {}

  ngOnInit(): void {
    this.getPermissions();
    this.listenCurrentRole();
  }

  async getPermissions(name?) {
    let res = {
      "modules": [
          {
              "name": "Leads",
              "permissions": [
                  {
                      "id": 1,
                      "name": "Add Lead",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 2,
                      "name": "Assign Lead",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 3,
                      "name": "Change Lead Status",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 4,
                      "name": "Add Lead Activity",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 5,
                      "name": "Add Lead Request",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 6,
                      "name": "Edit Lead Request",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 7,
                      "name": "Edit Lead",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 8,
                      "name": "Send Cil",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 9,
                      "name": "Send Sms",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 10,
                      "name": "Send Email",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 11,
                      "name": "Bulk Export",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 12,
                      "name": "Bulk Re-assign",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 13,
                      "name": "Bulk Change Status",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 14,
                      "name": "Bulk Delete",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 15,
                      "name": "Import Leads",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 16,
                      "name": "View Deleted Leads Page",
                      "description": "",
                      "module": "Leads",
                      "depends_on": ""
                  },
                  {
                      "id": 17,
                      "name": "Recover Deleted Leads",
                      "description": "",
                      "module": "Leads",
                      "depends_on": [
                          "View Deleted Leads Page"
                      ]
                  }
              ]
          },
          {
              "name": "Cold Calls",
              "permissions": [
                  {
                      "id": 18,
                      "name": "Import Data Sheet",
                      "description": "",
                      "module": "Cold Calls",
                      "depends_on": ""
                  },
                  {
                      "id": 19,
                      "name": "Delete Sheet",
                      "description": "",
                      "module": "Cold Calls",
                      "depends_on": ""
                  },
                  {
                      "id": 20,
                      "name": "Modify Contact",
                      "description": "like change it to not interested or no answer….",
                      "module": "Cold Calls",
                      "depends_on": ""
                  },
                  {
                      "id": 21,
                      "name": "Delete Contact",
                      "description": "",
                      "module": "Cold Calls",
                      "depends_on": ""
                  },
                  {
                      "id": 22,
                      "name": "Assign Contacts",
                      "description": "",
                      "module": "Cold Calls",
                      "depends_on": ""
                  },
                  {
                      "id": 63,
                      "name": "Export Data Sheet",
                      "description": "",
                      "module": "Cold Calls",
                      "depends_on": ""
                  }
              ]
          },
          {
              "name": "Import Logs",
              "permissions": [
                  {
                      "id": 23,
                      "name": "View Import Logs",
                      "description": "",
                      "module": "Import Logs",
                      "depends_on": ""
                  },
                  {
                      "id": 24,
                      "name": "Delete Log",
                      "description": "",
                      "module": "Import Logs",
                      "depends_on": ""
                  },
                  {
                      "id": 25,
                      "name": "Export Declined Data",
                      "description": "",
                      "module": "Import Logs",
                      "depends_on": [
                          "View Import Logs"
                      ]
                  }
              ]
          },
          {
              "name": "Inventory",
              "permissions": [
                  {
                      "id": 26,
                      "name": "Manage Projects",
                      "description": "Add or Edit Project",
                      "module": "Inventory",
                      "depends_on": ""
                  },
                  {
                      "id": 27,
                      "name": "Delete Project",
                      "description": "",
                      "module": "Inventory",
                      "depends_on": ""
                  },
                  {
                      "id": 28,
                      "name": "Manage Developers",
                      "description": "Add or Edit Developer",
                      "module": "Inventory",
                      "depends_on": ""
                  },
                  {
                      "id": 29,
                      "name": "Delete Developer",
                      "description": "",
                      "module": "Inventory",
                      "depends_on": ""
                  },
                  {
                      "id": 49,
                      "name": "Manage Properties",
                      "description": "Add or Edit Property",
                      "module": "Inventory",
                      "depends_on": ""
                  },
                  {
                      "id": 50,
                      "name": "Delete Property",
                      "description": "",
                      "module": "Inventory",
                      "depends_on": ""
                  },
                  {
                      "id": 53,
                      "name": "Manage Units",
                      "description": "Add or Edit Property",
                      "module": "Inventory",
                      "depends_on": ""
                  },
                  {
                      "id": 54,
                      "name": "Delete Unit",
                      "description": "",
                      "module": "Inventory",
                      "depends_on": ""
                  },
                  {
                      "id": 60,
                      "name": "View Projects",
                      "description": "",
                      "module": "Inventory",
                      "depends_on": ""
                  },
                  {
                      "id": 61,
                      "name": "View Developers",
                      "description": "",
                      "module": "Inventory",
                      "depends_on": ""
                  },
                  {
                      "id": 62,
                      "name": "View Units",
                      "description": "",
                      "module": "Inventory",
                      "depends_on": ""
                  }
              ]
          },
          {
              "name": "Accounts",
              "permissions": [
                  {
                      "id": 30,
                      "name": "View Users",
                      "description": "",
                      "module": "Accounts",
                      "depends_on": ""
                  },
                  {
                      "id": 31,
                      "name": "Manage Users",
                      "description": "Add or Edit User",
                      "module": "Accounts",
                      "depends_on": [
                          "View Users"
                      ]
                  },
                  {
                      "id": 32,
                      "name": "View Teams",
                      "description": "",
                      "module": "Accounts",
                      "depends_on": ""
                  },
                  {
                      "id": 33,
                      "name": "Manage Teams",
                      "description": "Add or Edit Team",
                      "module": "Accounts",
                      "depends_on": [
                          "View Teams"
                      ]
                  },
                  {
                      "id": 34,
                      "name": "Delete Team",
                      "description": "",
                      "module": "Accounts",
                      "depends_on": [
                          "View Teams"
                      ]
                  }
              ]
          },
          {
              "name": "Rotations",
              "permissions": [
                  {
                      "id": 35,
                      "name": "View Rotations",
                      "description": "",
                      "module": "Rotations",
                      "depends_on": ""
                  },
                  {
                      "id": 36,
                      "name": "Manage Rotations",
                      "description": "Add and edit rotation",
                      "module": "Rotations",
                      "depends_on": [
                          "View Rotations"
                      ]
                  },
                  {
                      "id": 37,
                      "name": "Delete Rotations",
                      "description": "",
                      "module": "Rotations",
                      "depends_on": [
                          "View Rotations"
                      ]
                  },
                  {
                      "id": 38,
                      "name": "Change Rotation Status",
                      "description": "",
                      "module": "Rotations",
                      "depends_on": [
                          "View Rotations"
                      ]
                  }
              ]
          },
          {
              "name": "Settings",
              "permissions": [
                  {
                      "id": 39,
                      "name": "Manage Form Options",
                      "description": "Will enable user to Modify (countries,governorates,districts,sources,campaigns,status and actions) of the system",
                      "module": "Settings",
                      "depends_on": ""
                  },
                  {
                      "id": 40,
                      "name": "Manage System Timers",
                      "description": "Read and update system timers",
                      "module": "Settings",
                      "depends_on": ""
                  },
                  {
                      "id": 41,
                      "name": "Manage System Themes",
                      "description": "Read and update system themes",
                      "module": "Settings",
                      "depends_on": ""
                  },
                  {
                      "id": 48,
                      "name": "Manage Manual Rating",
                      "description": "",
                      "module": "Settings",
                      "depends_on": ""
                  },
                  {
                      "id": 51,
                      "name": "Manage Sms and Mail Configuration",
                      "description": "",
                      "module": "Settings",
                      "depends_on": ""
                  },
                  {
                      "id": 52,
                      "name": "Manage Unit Form Options",
                      "description": "Will enable user to Modify (Unit Type, Unit Purpose,Unit Features)",
                      "module": "Settings",
                      "depends_on": ""
                  },
                  {
                      "id": 58,
                      "name": "Manage Notification List",
                      "description": "",
                      "module": "Settings",
                      "depends_on": ""
                  },
                  {
                      "id": 59,
                      "name": "Manage Lead Config",
                      "description": "Manage agent see activity history",
                      "module": "Settings",
                      "depends_on": ""
                  }
              ]
          },
          {
              "name": "Roles and Permissions",
              "permissions": [
                  {
                      "id": 42,
                      "name": "View Roles",
                      "description": "",
                      "module": "Roles and Permissions",
                      "depends_on": ""
                  },
                  {
                      "id": 43,
                      "name": "Modify Role",
                      "description": "Add , edit or delete role",
                      "module": "Roles and Permissions",
                      "depends_on": [
                          "View Roles"
                      ]
                  }
              ]
          },
          {
              "name": "Export Center",
              "permissions": [
                  {
                      "id": 44,
                      "name": "View Export Center",
                      "description": "",
                      "module": "Export Center",
                      "depends_on": ""
                  },
                  {
                      "id": 45,
                      "name": "Cancel Export",
                      "description": "",
                      "module": "Export Center",
                      "depends_on": [
                          "View Export Center"
                      ]
                  }
              ]
          },
          {
              "name": "Reports",
              "permissions": [
                  {
                      "id": 46,
                      "name": "View Rating Settings",
                      "description": "",
                      "module": "Reports",
                      "depends_on": ""
                  },
                  {
                      "id": 47,
                      "name": "Preview Rating Scores",
                      "description": "",
                      "module": "Reports",
                      "depends_on": ""
                  },
                  {
                      "id": 55,
                      "name": "View Leads Report",
                      "description": "",
                      "module": "Reports",
                      "depends_on": ""
                  },
                  {
                      "id": 56,
                      "name": "View Cold Calls Report",
                      "description": "",
                      "module": "Reports",
                      "depends_on": ""
                  },
                  {
                      "id": 57,
                      "name": "View Inventory Report",
                      "description": "",
                      "module": "Reports",
                      "depends_on": ""
                  }
              ]
          }
      ]
  };
    this.modules = res.modules;
    this.filters = [...this.modules];
    this.storedModules = [];
    this.storedModules = [...this.modules];


    // await this.rolesService.getPermissions(name).subscribe(
    //   (res: any) => {
    //     if (res) {
    //       this.modules = res.modules;
    //       this.filters = [...this.modules];
    //       this.storedModules = [];
    //       this.storedModules = [...this.modules];
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
        this.timerId = setTimeout(() => {
          this.bindCurrentRole();
          clearTimeout(this.timerId);
        }, 3000);
      }
    });
  }

  searchPermission(searchOptions?: any) {
    this.getPermissions(searchOptions.name);
    this.filtered = '';

    // this.modules = this.storedModules.filter(module =>  module.permissions.filter(per=>per.name.includes(searchOptions.name))); // end modules filter
  }

  //#region Bind and Select Permission
  bindCurrentRole() {
    if (Object.keys(this.role).length > 0) {
      if (this.role.modules && this.role.modules.length > 0) {
        this.role.modules.forEach((module) => {
          let _module = this.modules.find((a) => a.name == module.name);
          if (_module) {
            if (_module.permissions && _module.permissions.length == module.permissions.length) {
              _module.allSelected = true;

              _module.permissions.map((a) => {
                a.isChecked = true;
                a.isParent = false;
              });

              let choosedPerm = _module.permissions.map((a) => a.name);
              this.choosePermissions.emit({
                selectedPermissions: choosedPerm,
                isEdit: this.role.id ? true : false,
              });

              return;
            } else {
              module.permissions.forEach((permission) => {
                permission.isChecked = true;
                let _permission = _module.permissions.find((a) => a.id == permission.id);
                _permission.isChecked = true;
                this.selectPermission(_permission);
              });
            }
          }
        });
      }
    }
  }

  selectAllPermissions(module, target) {
    let _module = this.modules.find((a) => a.name == module.name);
    _module.permissions.map((a) => {
      a.isChecked = target.checked;
      delete a.isParent;
    });

    let choosedPerm = _module.permissions.map((a) => a.name);
    this.choosePermissions.emit({ selectedPermissions: choosedPerm });
  }

  selectPermission(permission) {
    let module = this.modules.find((a) => a.name == permission.module);
    module.allSelected = false;
    let parent_permissions = [];
    // remove isParent prop
    delete permission.isParent;

    // case: permission is child and has parents depend on
    if (permission.depends_on && permission.depends_on.length > 0) {
      parent_permissions = module.permissions.filter((item) => permission.depends_on.includes(item.name));
    }

    // case: permission is parent and has childs
    this.removeDepend(permission, module.permissions);

    this.choosePermissions.emit({
      selectedPermissions: [permission.name],
      modules: this.modules,
      isEdit: this.role.id ? true : false,
    });
  }

  removeDepend(permission, permissions) {
    let child_permissions = permissions.filter((item) => item.depends_on.includes(permission.name));
    console.log('child_permissions: ', child_permissions);
    if (child_permissions && child_permissions.length > 0) {
      if (permission.isChecked) {
        delete permission.isParent;
      } else {
        if (child_permissions.some((a) => a.isChecked)) {
          permission.isParent = true;
        } else {
          delete permission.isParent;
        }
      }
    } else {
      delete permission.isParent;
      let parent_permissions = permissions.filter((item) => permission.depends_on.includes(item.name));
      if (parent_permissions && parent_permissions.length > 0) {
        if (permission.isChecked)
          parent_permissions.map((a) => {
            a.isParent = true;
          });
        else
          parent_permissions.map((a) => {
            delete a.isParent;
          });
      }
    }
  }
  //#endregion

  // checkIfDependantChecked(permission, parent_permissions){
  //   // check dependant on permissions
  //   if(permission.isChecked){
  //     // let parent_permissions = this.modules.find(a=> a.name == permission.module).permissions.filter(a=> permission.depends_on.includes(a.name))
  //     if(parent_permissions){
  //       let unchecked_parents = parent_permissions.filter(a=> !a.isChecked);
  //       let checked_parents = parent_permissions.filter(a=> a.isChecked);
  //       if(checked_parents && checked_parents.length > 0)
  //         checked_parents.map(a=> {a.isParent = false; a.parentChecked = true;});
  //       if(unchecked_parents && unchecked_parents.length > 0)
  //         unchecked_parents.map(a=> {a.isParent = true; a.parentChecked = false;});
  //     }
  //   }

  // }

  //#region Filter

  filterModule(module) {
    this.modules = [];
    this.modules = [module];
    this.filtered = module.name;
  }

  allModules() {
    this.modules = [];
    this.modules = [...this.storedModules];
    this.filtered = '';
  }

  //#endregion

  ngOnDestroy(): void {
    clearTimeout(this.timerId);
  }
}
