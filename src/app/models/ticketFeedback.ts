import { Attachment } from "./attachment";
import { User } from "./user";


export interface TicketFeedback {
  id?: number;
  ticket_id?: number;
  description?: string;
  user_id?: number;
  help_desk_department_id?: any;
  created_at?: Date;
  updated_at?: Date;
  user?: User | any;
  department?: any;
  attachments?: Attachment[];
}
