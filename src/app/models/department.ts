import { User } from './user';
export interface Department {
  id?:                     number;
  name?:                   string;
  is_crm_head_department?: number;
  head_user_id?:           number;
  created_at?:             Date;
  updated_at?:             Date;
  head?:                   User;
  users?:                  User[];
}
