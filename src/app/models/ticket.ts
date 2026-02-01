import { TicketApproval } from "./ticketApproval";
import { Attachment } from "./attachment";
import { TicketCustomer } from "./ticketCustomer";
import { TicketFeedback } from "./ticketFeedback";
import { Lead } from "./Lead";
import { TicketPermissions } from "./ticketPermissions";
import { HelpdeskPriority } from "./helpdeskPriority";
import { User } from "./user";

export interface Ticket {
  id?:                  number;
  title?:               string;
  description?:         string;
  type_id?:             number;
  status_id?:           number;
  ticket_client_request_id?:           number;
  priority_id?:         number;
  source_id?:           number;
  lead_id?:             number;
  department_id?:       any;
  user_id?:             number;
  assigned_user_id?:    any;
  unit_id?:             any;
  is_resolved?:         any;
  time_to_next_action?: any;
  is_finished?:         number;
  created_at?:          Date;
  updated_at?:          Date;
  requires_approval?:   boolean;
  pending_approval?:    TicketApproval;
  permissions?:         TicketPermissions;
  type?:                HelpdeskPriority;
  status?:              HelpdeskPriority;
  priority?:            HelpdeskPriority;
  source?:              HelpdeskPriority;
  customer?:            TicketCustomer;
  lead?:                Lead;
  department?:          any;
  user?:                User;
  assigned_user?:       any;
  unit?:                any;
  approvals?:           TicketApproval[];
  reservations?:        any[];
  attachments?:         Attachment[];
  feedbacks?:           TicketFeedback[];
}


