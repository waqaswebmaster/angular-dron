export interface IUser {
  id: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email: string;
  photo?: string;
  photo_cropped?: string;
  email_is_verified: boolean;
  phone?: string;
  country?: number;
  language?: string;
  language_name?: string;
  level?: number;
  flights?: number;
  flights_hours?: string;
  date_joined: string;
  last_login: string;
}
