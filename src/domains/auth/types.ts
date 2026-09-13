export interface Profile {
  id: string;
  username: string;
  email: string;
  role: 'customer' | 'admin';
  created_at: string;
}
