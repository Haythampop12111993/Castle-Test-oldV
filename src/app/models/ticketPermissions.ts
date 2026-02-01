
export interface TicketPermissions {
  can_edit_ticket?: boolean;
  can_delete_ticket?: boolean;
  can_assign_ticket?: boolean;
  can_add_feedback?: boolean;
  can_ask_approval?: boolean;
  can_accept_approval?: boolean;
  can_mark_as_resolved?: boolean;
  can_mark_as_finished?: boolean;
  can_change_status?: boolean;
  can_reopen_ticket?: boolean;
}
