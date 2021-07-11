import {IUser} from "@app/types";
import {getMediaUrl} from "@shared/helpers/common";

export class UserModel {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  photo: string;
  photo_cropped: string;
  email: string;
  email_is_verified: boolean;
  phone: string;
  country: number;
  language: string;
  level: number;
  flights: number;
  flights_hours: string;
  date_joined: string;
  last_login: string;

  country_name: string;
  language_name: string;
  level_name: string;
  photo_url: string;

  constructor(init: IUser) {
    const data = {
      id: null,
      first_name: '',
      last_name: '',
      full_name: '',
      photo: null,
      photo_cropped: null,
      email: '',
      email_is_verified: false,
      phone: null,
      country: null,
      language: null,
      level: null,
      flights: null,
      flights_hours: null,
      date_joined: null,
      last_login: null,
      country_name: '',
      language_name: '',
      level_name: '',
      ...init,
    };

    this.id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.full_name = data.full_name || `${data.first_name}${data.first_name ? ' ' : ''}${data.last_name}`;
    this.photo = data.photo;
    this.photo_cropped = data.photo_cropped;
    this.email = data.email;
    this.email_is_verified = data.email_is_verified;
    this.phone = data.phone;
    this.country = data.country;
    this.language = data.language;
    this.level = data.level;
    this.flights = data.flights;
    this.flights_hours = data.flights_hours;
    this.date_joined = data.date_joined;
    this.last_login = data.last_login;

    this.country_name = data.country_name;
    this.language_name = data.language_name;
    this.level_name = data.level_name;
    this.photo_url = getMediaUrl(this.photo_cropped || this.photo);
  }
}
