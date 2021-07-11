import {IManufacturer} from "@app/types";

export class ManufacturerModel {
  id: string;
  name: string;
  photo: string;
  email: string;
  limit: number;
  value: string;

  constructor(init: IManufacturer) {
    const data = {
      id: '',
      name: '',
      photo: '',
      email: '',
      limit: null,
      value: '',
      size: '',
      ...init,
    };

    this.id = data.id;
    this.name = data.name;
    this.photo = data.photo;
    this.email = data.email;
    this.limit = data.limit;
    this.value = data.value;
  }
}
