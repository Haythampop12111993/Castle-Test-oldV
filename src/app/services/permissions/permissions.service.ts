import { Injectable } from '@angular/core';

@Injectable()
export class PermissionsService {
  user: any = JSON.parse(window.localStorage.getItem('user'));
  role: any = '';
  // role: any = this.user.roles[0].name;
  permissions: any = [];

  // constructor(private diskSer: DiskService) {
  //   this.diskSer.currentPermissions$.subscribe((res) => {
  //     this.permissions = res;
  //   });
  // }

  constructor(){}
  //#region /** Start of Leads Module Permissions */

  get can_add_lead(): boolean {
    return this.isAuth('Add Lead');
  }

  get can_assign_lead(): boolean {
    return this.isAuth('Assign Lead');
  }

  get can_change_lead_status(): boolean {
    return this.isAuth('Change Lead Status');
  }

  get can_add_lead_activity(): boolean {
    return this.isAuth('Add Lead Activity');
  }

  get can_add_lead_request(): boolean {
    return this.isAuth('Add Lead Request');
  }

  get can_edit_lead_request(): boolean {
    return this.isAuth('Edit Lead Request');
  }

  get can_edit_lead(): boolean {
    return this.isAuth('Edit Lead');
  }

  get can_send_cil(): boolean {
    return this.isAuth('Send Cil');
  }

  get can_send_sms(): boolean {
    return this.isAuth('Send Sms');
  }

  get can_send_email(): boolean {
    return this.isAuth('Send Email');
  }

  get can_export_bulk_lead(): boolean {
    return this.isAuth('Bulk Export');
  }

  get can_reassign_bulk_lead(): boolean {
    return this.isAuth('Bulk Re-assign');
  }

  get can_change_status_bulk_lead(): boolean {
    return this.isAuth('Bulk Change Status');
  }

  get can_delete_bulk_lead(): boolean {
    return this.isAuth('Bulk Delete');
  }

  get can_import_leads(): boolean {
    return this.isAuth('Import Leads');
  }

  get can_view_deleted_leads(): boolean {
    return this.isAuth('View Deleted Leads Page');
  }

  get can_recover_deleted_leads(): boolean {
    return this.isAuth('Recover Deleted Leads');
  }
  //#endregion

  //#region /** Start of cold calls permissions */

  get can_export_Data_sheet(): boolean {
    return this.isAuth('Export Data Sheet');
  }

  get can_import_Data_sheet(): boolean {
    return this.isAuth('Import Data Sheet');
  }

  get can_delete_sheet(): boolean {
    return this.isAuth('Delete Sheet');
  }

  get can_modify_contact(): boolean {
    return this.isAuth('Modify Contact');
  }

  get can_delete_contact(): boolean {
    return this.isAuth('Delete Contact');
  }

  get can_assign_contacts(): boolean {
    return this.isAuth('Assign Contacts');
  }

  //#endregion

  //#region /** Start of import logs permissions */

  get can_view_import_logs(): boolean {
    return this.isAuth('View Import Logs');
  }

  get can_delete_logs(): boolean {
    return this.isAuth('Delete Log');
  }

  get can_export_declined_data(): boolean {
    return this.isAuth('Export Declined Data');
  }

  //#endregion

  //#region /** Start of inventory permissions */

  get can_see_inventory_tabs(): boolean {
    if (this.can_view_projects || this.can_view_developers || this.can_view_units) {
      return true;
    } else {
      return false;
    }
  }

  get can_view_projects(): boolean {
    return this.isAuth('View Projects');
  }

  get can_view_developers(): boolean {
    return this.isAuth('View Developers');
  }

  get can_view_units(): boolean {
    return this.isAuth('View Units');
  }

  get can_manage_projects(): boolean {
    return this.isAuth('Manage Projects');
  }

  get can_delete_project(): boolean {
    return this.isAuth('Delete Project');
  }

  get can_manage_developers(): boolean {
    return this.isAuth('Manage Developers');
  }

  get can_delete_developer(): boolean {
    return this.isAuth('Delete Developer');
  }

  get can_manage_units(): boolean {
    return this.isAuth('Manage Units');
  }

  get can_delete_unit(): boolean {
    return this.isAuth('Delete Unit');
  }

  //#endregion

  //#region /** Start of export center permissions */

  get can_view_export_center(): boolean {
    //   let user = JSON.parse(localStorage.getItem('user'));
    //   console.log('user : ', user);
    //   let role = user.roles[0].name;
    // return role.toLocaleLowerCase() != 'sales_agent';
    return this.isAuth('View Export Center');
  }

  //#endregion

  //#region  Start Accounts permissions
  get can_view_users(): boolean {
    return this.isAuth('View Users');
  }

  get can_manage_users(): boolean {
    return this.isAuth('Manage Users');
  }

  get can_view_teams(): boolean {
    return this.isAuth('View Teams');
  }

  get can_manage_teams(): boolean {
    return this.isAuth('Manage Teams');
  }

  get can_delete_team(): boolean {
    return this.isAuth('Delete Team');
  }

  //#endregion

  //#region  Start rotations permissions
  get can_view_rotations(): boolean {
    return this.isAuth('View Rotations');
  }

  get can_manage_rotations(): boolean {
    return this.isAuth('Manage Rotations');
  }

  get can_change_rotation_status(): boolean {
    return this.isAuth('Change Rotation Status');
  }

  get can_delete_rotations(): boolean {
    return this.isAuth('Delete Rotations');
  }

  //#endregion

  //#region  Start settings permissions
  get can_manage_notifications(): boolean {
    return this.isAuth('Manage Notification List');
  }

  get can_manage_form_options(): boolean {
    return this.isAuth('Manage Form Options');
  }

  get can_manage_system_timers(): boolean {
    return this.isAuth('Manage System Timers');
  }

  get can_manage_system_themes(): boolean {
    return this.isAuth('Manage System Themes');
  }

  get can_manage_inventory_form_options(): boolean {
    return this.isAuth('Manage Unit Form Options');
  }

  //#region SMS Config permissions
  get can_show_sms_config(): boolean {
    return this.isAuth('Manage Sms and Mail Configuration');
  }
  
  get can_show_lead_config(): boolean {
    return this.isAuth('Manage Lead Config');
  }

  get can_show_general_config(): boolean {
    if (this.can_show_sms_config || this.can_manage_system_timers || this.can_manage_notifications || this.can_show_lead_config) {
      return true;
    } else {
      return false;
    }
  
  }
  //#endregion

  //#region  Start roles permissions
  get can_view_roles(): boolean {
    return this.isAuth('View Roles');
  }

  get can_modify_role(): boolean {
    return this.isAuth('Modify Role');
  }

  //#endregion

  //#region  Start rating permissions

  get can_see_rating_tabs(): boolean {
    if (this.can_view_rating_setting || this.can_view_rating_score) {
      return true;
    } else {
      return false;
    }
  }

  get can_view_rating_setting(): boolean {
    return this.isAuth('View Rating Settings');
  }

  get can_view_rating_score(): boolean {
    return this.isAuth('Preview Rating Scores');
  }

  get can_view_manual_rate(): boolean {
    return this.isAuth('Manage Manual Rating');
  }

  //#endregion

  //#region Reports
  get can_manage_leads_reports(): boolean {
    return this.isAuth('View Leads Report');
  }

  get can_manage_coldcall_reports(): boolean {
    return this.isAuth('View Cold Calls Report');
  }

  get can_manage_inventory_reports(): boolean {
    return this.isAuth('View Inventory Report');
  }

  get can_manage_reports(): boolean {
    if (this.can_manage_coldcall_reports || this.can_manage_inventory_reports || this.can_manage_leads_reports)
      return true;
    else return false;
  }
  //#endregion

  //#endregion

  /** Start of settings permissions */

  get can_see_settings_tabs(): boolean {
    if (
      this.can_view_users ||
      this.can_view_teams ||
      this.can_manage_form_options ||
      this.can_manage_inventory_form_options ||
      this.can_view_rotations ||
      this.can_view_roles ||
      this.can_view_manual_rate ||
      this.can_show_sms_config ||
      this.can_manage_system_timers ||
      this.can_manage_system_themes ||
      this.can_manage_notifications
    ) {
      return true;
    } else {
      return false;
    }
  }

  /** End of settings permissions */

  get is_projects_viewer(): boolean {
    let userProfile = JSON.parse(window.localStorage.getItem('userProfile'));
    return userProfile && userProfile.role == 'Broker';
  }

  isAuth(permission) {
    let index = this.permissions.findIndex((a) => a.trim() == permission.trim());
    return index > -1 ? true : false;
  }
}
