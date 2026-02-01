export class User {
  id: "";
  about: "";
  name: "";
  email: "";
  password: "";
  role: { id: ""; value: "" };
  job_title: "";
  phone: "";
  facebook_url: "";
  twitter_url: "";
  instagram_url: "";
  uploader: {};
  brokerCompany: "";
  can_manage_payment_plan = false;
  is_full_access = true;

  constructor() {}
}
