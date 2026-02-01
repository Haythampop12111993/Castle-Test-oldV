import { Department } from "./department";
import { User } from "./user";


export interface TicketApproval {
  id?: number;
  ticket_id?: number;
  description?: any;
  feedback_id?: any;
  is_approved?: any;
  user_id?: number;
  department_id?: number;
  action_taken_by_user_id?: any;
  created_at?: Date;
  updated_at?: Date;
  user?: User;
  department?: Department;
  action_taken_by?: any;
  attachments?:any;
}
