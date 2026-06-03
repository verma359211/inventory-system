export interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  created_at: string;
}

export interface CustomerCreate {
  full_name: string;
  email: string;
  phone_number: string;
}
