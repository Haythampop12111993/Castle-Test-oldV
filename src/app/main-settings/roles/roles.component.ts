import { param } from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from './roles.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PermissionsService } from '../../services/permissions/permissions.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RolesComponent implements OnInit, AfterViewInit {
  //#region Definitions
  filtered = '';
  roles: any = [];
  ignoredRoles: any = [];
  levelsRoles: any = [];
  tableData: any = [];
  selectedRole: any = {};
  selectedRoleId: any = '';
  ignore_headElements = ['Ignore Roles', 'Permissions', 'Modules', 'Action'];
  headElements = ['Hirerachy', 'Permissions', 'Modules', 'Action'];
  dataSource: any[];
  ignoredSource: any[];
  levelsSource: any[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('ignoredSort') ignoredSort: MatSort;
  expandedElement: any;

  //#endregion

  constructor(private rolsSer: RolesService, private router: Router, public permissionsService: PermissionsService) {}

  ngOnInit(): void {
    this.bindSortingDataAccessors();
    this.getRoles();
  }

  ngAfterViewInit() {

  }

  bindSortingDataAccessors() {
 
  }

  getRoles(name?) {

    this.roles = [
      {
          "id": 7,
          "name": "test role",
          "guard_name": "api",
          "created_at": "2021-06-24T12:41:34.000000Z",
          "updated_at": "2021-06-24T12:41:34.000000Z",
          "level": 0,
          "upper_role_id": 1,
          "permissions_count": 3,
          "modules": [
              "Import Logs"
          ]
      },
      {
          "id": 20,
          "name": "adminx",
          "guard_name": "api",
          "created_at": "2021-07-13T12:36:39.000000Z",
          "updated_at": "2021-07-13T12:36:39.000000Z",
          "level": 0,
          "upper_role_id": 1,
          "permissions_count": 45,
          "modules": [
              "Accounts",
              "Cold Calls",
              "Export Center",
              "Import Logs",
              "Inventory",
              "Leads",
              "Roles and Permissions",
              "Rotations",
              "Settings"
          ]
      },
      {
          "id": 22,
          "name": "call center",
          "guard_name": "api",
          "created_at": "2021-07-28T13:38:03.000000Z",
          "updated_at": "2021-07-28T13:38:03.000000Z",
          "level": 0,
          "upper_role_id": 1,
          "permissions_count": 3,
          "modules": [
              "Inventory"
          ]
      },
      {
          "id": 23,
          "name": "accoutant",
          "guard_name": "api",
          "created_at": "2021-11-03T14:51:50.000000Z",
          "updated_at": "2021-11-03T14:51:50.000000Z",
          "level": 0,
          "upper_role_id": 1,
          "permissions_count": 3,
          "modules": [
              "Cold Calls",
              "Leads"
          ]
      },
      {
          "id": 24,
          "name": "super admin test role",
          "guard_name": "api",
          "created_at": "2021-11-10T13:28:56.000000Z",
          "updated_at": "2021-11-10T13:28:56.000000Z",
          "level": 0,
          "upper_role_id": 1,
          "permissions_count": 58,
          "modules": [
              "Accounts",
              "Cold Calls",
              "Export Center",
              "Import Logs",
              "Inventory",
              "Leads",
              "Reports",
              "Roles and Permissions",
              "Rotations",
              "Settings"
          ]
      },
      {
          "id": 1,
          "name": "admin",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 1,
          "upper_role_id": 7,
          "permissions_count": 63,
          "modules": [
              "Accounts",
              "Cold Calls",
              "Export Center",
              "Import Logs",
              "Inventory",
              "Leads",
              "Reports",
              "Roles and Permissions",
              "Rotations",
              "Settings"
          ]
      },
      {
          "id": 17,
          "name": "CEO Test",
          "guard_name": "api",
          "created_at": "2021-07-13T09:48:31.000000Z",
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 2,
          "upper_role_id": 1,
          "permissions_count": 45,
          "modules": [
              "Accounts",
              "Cold Calls",
              "Export Center",
              "Import Logs",
              "Inventory",
              "Leads",
              "Roles and Permissions",
              "Rotations",
              "Settings"
          ]
      },
      {
          "id": 2,
          "name": "CEO",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 3,
          "upper_role_id": 17,
          "permissions_count": 45,
          "modules": [
              "Accounts",
              "Cold Calls",
              "Export Center",
              "Import Logs",
              "Inventory",
              "Leads",
              "Roles and Permissions",
              "Rotations",
              "Settings"
          ]
      },
      {
          "id": 4,
          "name": "team_leader",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 4,
          "upper_role_id": 2,
          "permissions_count": 31,
          "modules": [
              "Cold Calls",
              "Export Center",
              "Import Logs",
              "Inventory",
              "Leads"
          ]
      },
      {
          "id": 3,
          "name": "sales_director",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 5,
          "upper_role_id": 4,
          "permissions_count": 35,
          "modules": [
              "Cold Calls",
              "Export Center",
              "Import Logs",
              "Inventory",
              "Leads"
          ]
      },
      {
          "id": 6,
          "name": "sales_manager",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 6,
          "upper_role_id": 3,
          "permissions_count": 29,
          "modules": [
              "Cold Calls",
              "Export Center",
              "Import Logs",
              "Inventory",
              "Leads"
          ]
      },
      {
          "id": 19,
          "name": "team_leader_test",
          "guard_name": "api",
          "created_at": "2021-07-13T10:52:31.000000Z",
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 7,
          "upper_role_id": 6,
          "permissions_count": 27,
          "modules": [
              "Cold Calls",
              "Export Center",
              "Import Logs",
              "Leads"
          ]
      },
      {
          "id": 5,
          "name": "sales_agent",
          "guard_name": "api",
          "created_at": null,
          "updated_at": "2021-11-28T12:42:02.000000Z",
          "level": 8,
          "upper_role_id": 19,
          "permissions_count": 18,
          "modules": [
              "Cold Calls",
              "Export Center",
              "Import Logs",
              "Leads"
          ]
      }
  ];

    this.tableData = this.roles;

    this.ignoredRoles = this.roles.filter((a) => a.level == 0);
    this.levelsRoles = this.roles.filter((a) => a.level != 0);

    console.log('roles: ', this.roles, ' ignored: ', this.ignoredRoles, ' level: ', this.levelsRoles);
    
    // this.rolsSer.getListingRoles(name).subscribe(
    //   (res: any) => {
    //     if (res) {
    //       this.roles = res;
    //       // this.dataSource.data = res;
    //       // this.tableData = this.roles;
    //       // this.ignoredRoles = this.roles.filter((a) => a.level == 0);
    //       // this.ignoredSource.data = this.ignoredRoles;
    //       // this.levelsRoles = this.roles.filter((a) => a.level != 0);
    //       // this.levelsSource.data = this.levelsRoles;
    //     }
    //   },
    //   (err) => {
    //     console.log('error');
    //   }
    // );
  }

  getRole(role_id) {
    if (this.selectedRoleId == role_id) {
      this.selectedRole = '';
      this.selectedRoleId = '';
    } else {
      this.selectedRole = {
        "id": 1,
        "name": "admin",
        "upper_role_id": 7,
        "level": 1,
        "modules": [
            {
                "name": "Leads",
                "permissions": [
                    {
                        "id": 1,
                        "name": "Add Lead",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 1
                        }
                    },
                    {
                        "id": 2,
                        "name": "Assign Lead",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 2
                        }
                    },
                    {
                        "id": 3,
                        "name": "Change Lead Status",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 3
                        }
                    },
                    {
                        "id": 4,
                        "name": "Add Lead Activity",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 4
                        }
                    },
                    {
                        "id": 5,
                        "name": "Add Lead Request",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 5
                        }
                    },
                    {
                        "id": 6,
                        "name": "Edit Lead Request",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 6
                        }
                    },
                    {
                        "id": 7,
                        "name": "Edit Lead",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 7
                        }
                    },
                    {
                        "id": 8,
                        "name": "Send Cil",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 8
                        }
                    },
                    {
                        "id": 9,
                        "name": "Send Sms",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 9
                        }
                    },
                    {
                        "id": 10,
                        "name": "Send Email",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 10
                        }
                    },
                    {
                        "id": 11,
                        "name": "Bulk Export",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 11
                        }
                    },
                    {
                        "id": 12,
                        "name": "Bulk Re-assign",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 12
                        }
                    },
                    {
                        "id": 13,
                        "name": "Bulk Change Status",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 13
                        }
                    },
                    {
                        "id": 14,
                        "name": "Bulk Delete",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 14
                        }
                    },
                    {
                        "id": 15,
                        "name": "Import Leads",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 15
                        }
                    },
                    {
                        "id": 16,
                        "name": "View Deleted Leads Page",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 16
                        }
                    },
                    {
                        "id": 17,
                        "name": "Recover Deleted Leads",
                        "module": "Leads",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 17
                        }
                    }
                ]
            },
            {
                "name": "Cold Calls",
                "permissions": [
                    {
                        "id": 18,
                        "name": "Import Data Sheet",
                        "module": "Cold Calls",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 18
                        }
                    },
                    {
                        "id": 19,
                        "name": "Delete Sheet",
                        "module": "Cold Calls",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 19
                        }
                    },
                    {
                        "id": 20,
                        "name": "Modify Contact",
                        "module": "Cold Calls",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 20
                        }
                    },
                    {
                        "id": 21,
                        "name": "Delete Contact",
                        "module": "Cold Calls",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 21
                        }
                    },
                    {
                        "id": 22,
                        "name": "Assign Contacts",
                        "module": "Cold Calls",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 22
                        }
                    },
                    {
                        "id": 63,
                        "name": "Export Data Sheet",
                        "module": "Cold Calls",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 63
                        }
                    }
                ]
            },
            {
                "name": "Import Logs",
                "permissions": [
                    {
                        "id": 23,
                        "name": "View Import Logs",
                        "module": "Import Logs",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 23
                        }
                    },
                    {
                        "id": 24,
                        "name": "Delete Log",
                        "module": "Import Logs",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 24
                        }
                    },
                    {
                        "id": 25,
                        "name": "Export Declined Data",
                        "module": "Import Logs",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 25
                        }
                    }
                ]
            },
            {
                "name": "Inventory",
                "permissions": [
                    {
                        "id": 26,
                        "name": "Manage Projects",
                        "module": "Inventory",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 26
                        }
                    },
                    {
                        "id": 27,
                        "name": "Delete Project",
                        "module": "Inventory",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 27
                        }
                    },
                    {
                        "id": 28,
                        "name": "Manage Developers",
                        "module": "Inventory",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 28
                        }
                    },
                    {
                        "id": 29,
                        "name": "Delete Developer",
                        "module": "Inventory",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 29
                        }
                    },
                    {
                        "id": 49,
                        "name": "Manage Properties",
                        "module": "Inventory",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 49
                        }
                    },
                    {
                        "id": 50,
                        "name": "Delete Property",
                        "module": "Inventory",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 50
                        }
                    },
                    {
                        "id": 53,
                        "name": "Manage Units",
                        "module": "Inventory",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 53
                        }
                    },
                    {
                        "id": 54,
                        "name": "Delete Unit",
                        "module": "Inventory",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 54
                        }
                    },
                    {
                        "id": 60,
                        "name": "View Projects",
                        "module": "Inventory",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 60
                        }
                    },
                    {
                        "id": 61,
                        "name": "View Developers",
                        "module": "Inventory",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 61
                        }
                    },
                    {
                        "id": 62,
                        "name": "View Units",
                        "module": "Inventory",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 62
                        }
                    }
                ]
            },
            {
                "name": "Accounts",
                "permissions": [
                    {
                        "id": 30,
                        "name": "View Users",
                        "module": "Accounts",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 30
                        }
                    },
                    {
                        "id": 31,
                        "name": "Manage Users",
                        "module": "Accounts",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 31
                        }
                    },
                    {
                        "id": 32,
                        "name": "View Teams",
                        "module": "Accounts",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 32
                        }
                    },
                    {
                        "id": 33,
                        "name": "Manage Teams",
                        "module": "Accounts",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 33
                        }
                    },
                    {
                        "id": 34,
                        "name": "Delete Team",
                        "module": "Accounts",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 34
                        }
                    }
                ]
            },
            {
                "name": "Rotations",
                "permissions": [
                    {
                        "id": 35,
                        "name": "View Rotations",
                        "module": "Rotations",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 35
                        }
                    },
                    {
                        "id": 36,
                        "name": "Manage Rotations",
                        "module": "Rotations",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 36
                        }
                    },
                    {
                        "id": 37,
                        "name": "Delete Rotations",
                        "module": "Rotations",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 37
                        }
                    },
                    {
                        "id": 38,
                        "name": "Change Rotation Status",
                        "module": "Rotations",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 38
                        }
                    }
                ]
            },
            {
                "name": "Settings",
                "permissions": [
                    {
                        "id": 39,
                        "name": "Manage Form Options",
                        "module": "Settings",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 39
                        }
                    },
                    {
                        "id": 40,
                        "name": "Manage System Timers",
                        "module": "Settings",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 40
                        }
                    },
                    {
                        "id": 41,
                        "name": "Manage System Themes",
                        "module": "Settings",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 41
                        }
                    },
                    {
                        "id": 48,
                        "name": "Manage Manual Rating",
                        "module": "Settings",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 48
                        }
                    },
                    {
                        "id": 51,
                        "name": "Manage Sms and Mail Configuration",
                        "module": "Settings",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 51
                        }
                    },
                    {
                        "id": 52,
                        "name": "Manage Unit Form Options",
                        "module": "Settings",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 52
                        }
                    },
                    {
                        "id": 58,
                        "name": "Manage Notification List",
                        "module": "Settings",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 58
                        }
                    },
                    {
                        "id": 59,
                        "name": "Manage Lead Config",
                        "module": "Settings",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 59
                        }
                    }
                ]
            },
            {
                "name": "Roles and Permissions",
                "permissions": [
                    {
                        "id": 42,
                        "name": "View Roles",
                        "module": "Roles and Permissions",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 42
                        }
                    },
                    {
                        "id": 43,
                        "name": "Modify Role",
                        "module": "Roles and Permissions",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 43
                        }
                    }
                ]
            },
            {
                "name": "Export Center",
                "permissions": [
                    {
                        "id": 44,
                        "name": "View Export Center",
                        "module": "Export Center",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 44
                        }
                    },
                    {
                        "id": 45,
                        "name": "Cancel Export",
                        "module": "Export Center",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 45
                        }
                    }
                ]
            },
            {
                "name": "Reports",
                "permissions": [
                    {
                        "id": 46,
                        "name": "View Rating Settings",
                        "module": "Reports",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 46
                        }
                    },
                    {
                        "id": 47,
                        "name": "Preview Rating Scores",
                        "module": "Reports",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 47
                        }
                    },
                    {
                        "id": 55,
                        "name": "View Leads Report",
                        "module": "Reports",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 55
                        }
                    },
                    {
                        "id": 56,
                        "name": "View Cold Calls Report",
                        "module": "Reports",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 56
                        }
                    },
                    {
                        "id": 57,
                        "name": "View Inventory Report",
                        "module": "Reports",
                        "pivot": {
                            "role_id": 1,
                            "permission_id": 57
                        }
                    }
                ]
            }
        ]
      };
      this.selectedRoleId = role_id;

      // this.rolsSer.getRole(role_id).subscribe(
      //   (res: any) => {
      //     this.selectedRole = res;
      //     this.selectedRoleId = role_id;
      //   },
      //   (err) => {
      //     console.log('error');
      //   }
      // );
    }
  }

  deleteRole(id) {
    // swal({
    //   icon: 'warning',
    //   title: 'Warning',
    //   text: 'Are you sure you want to deleted role?',
    //   showConfirmButton: true,
    //   showCancelButton: true,
    // }).then((res) => {
    //   if (res.isConfirmed) {
    //     this.rolsSer.deleteRole(id).subscribe(
    //       (res) => {
    //         swal.fire('Success', 'Role Deleted !!', 'success');
    //         this.filtered = '';
    //         this.ngOnInit();
    //       },
    //       (err) => {
    //         if (err.status == 400) {
    //           swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text:
    //               err.error.message +
    //               ', to delete it you have to give these users a new roles. Go to users page to do this? ',
    //             showConfirmButton: true,
    //             showCancelButton: true,
    //             confirmButtonText: 'Yes, take me their',
    //           }).then((res) => {
    //             if (res.isConfirmed) {
    //               this.router.navigateByUrl(`/dashboard/settings/accounts?role=${id}`);
    //             }
    //           });
    //         }
    //         console.log(err);
    //       }
    //     );
    //   }
    // });
  }

  editRole() {}

  searchRoles(searchOptions?: any) {
    this.getRoles(searchOptions.name);
  }

  filterRoles(filter) {
    switch (filter) {
      case 'all':
        this.filtered = '';
        this.tableData = this.roles;

        break;
      case 'ignore':
        this.filtered = 'ignore';
        this.tableData = this.ignoredRoles;

        break;
      case 'levels':
        this.filtered = 'levels';
        this.tableData = this.levelsRoles;

        break;

      default:
        this.filtered = '';

        break;
    }
  }
}


