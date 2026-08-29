export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role_id: number,
  dp?: string,
  role?: string;
  user_company_id?: string;
  created_at?: string;
  phone?: string;
}
