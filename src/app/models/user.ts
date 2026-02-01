
export interface User {
  id?: number;
  name?: string;
  email?: string;
  employee_code?: any;
  phone?: any;
  other_phone?: any;
  role?: string;
  is_c_level?: any;
  fcm_token?: string;
  team_id?: any;
  job_title?: any;
  image_id?: any;
  broker_id?: any;
  is_active?: number;
  is_taken?: number;
  about?: any;
  facebook_url?: any;
  twitter_url?: any;
  instagram_url?: any;
  is_special?: number;
  is_arm?: number;
  is_assistant?: number;
  created_at?: Date;
  updated_at?: Date;
  can_manage_payment_plan?: boolean;
  department_id?: any;
  is_sales_team?: boolean;
  is_sales_top_level?: boolean;
}
