import {IOrganisation} from "@app/types";
import {UserModel} from "@models/user.model";
import {getMediaUrl} from "@shared/helpers/common";

export class OrganisationModel {
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
  zip: string;
  activity: number;
  size: number;
  country_name: string;
  state_name: string;
  activity_name: string;
  editable: boolean;
  deletable: boolean;
  members: number[];
  staff: UserModel[];

  logo: string;
  size_text: string;

  constructor(init: IOrganisation) {
    const data = {
      id: null,
      name: '',
      photo: null,
      photo_cropped: null,
      email: '',
      phone: '',
      website: '',
      activity: null,
      country: null,
      state: null,
      address: '',
      zip: '',
      size: null,
      country_name: '',
      state_name: '',
      activity_name: '',
      editable: false,
      deletable: false,
      members: [],
      staff: [],
      ...init,
    };

    this.id = data.id;
    this.name = data.name;
    this.photo = data.photo;
    this.photo_cropped = data.photo_cropped;
    this.email = data.email;
    this.phone = data.phone;
    this.website = data.website;
    this.activity = data.activity;
    this.country = data.country;
    this.state = data.state;
    this.address = data.address;
    this.zip = data.zip;
    this.size = data.size;
    this.country_name = data.country_name;
    this.state_name = data.state_name;
    this.activity_name = data.activity_name;
    this.editable = data.editable;
    this.deletable = data.deletable;
    this.members = data.members;
    this.staff = data.staff.map((staff) => new UserModel(staff));

    this.logo = getMediaUrl(this.photo_cropped || this.photo);
  }
}
