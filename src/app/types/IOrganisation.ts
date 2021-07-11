import {IUser} from "./IUser";

export interface IOrganisation {
  id: number;
  name: string;
  photo: string;
  photo_cropped: string;
  email: string;
  phone: string;
  website: string;
  country: number;
  state: number;
  address: string;
  country_name: string;
  state_name: string;
  zip: string;
  activity: number;
  activity_name: string;
  size: number;
  editable: boolean;
  deletable: boolean;
  members: number[];
  staff: IUser[];
}
