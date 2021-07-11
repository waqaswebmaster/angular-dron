import {ISmartLink} from "@app/types";
import {UserModel} from "@models/user.model";

export class SmartLinkModel {
  uuid_link: string;
  name: string;
  owner: UserModel;
  created: string;
  ip_address: string;
  software: string;
  is_online: boolean;
  last_seen: string;
  port: number;
  users: UserModel[];

  constructor(init: ISmartLink) {
    const data = {
      uuid_link: '',
      name: '',
      created: '',
      ip_address: '',
      software: '',
      is_online: false,
      last_seen: '',
      port: null,
      users: [],
      ...init,
    };

    this.uuid_link = data.uuid_link;
    this.name = data.name;
    this.owner = new UserModel(data.owner);
    this.created = data.created;
    this.ip_address = data.ip_address;
    this.software = data.software;
    this.is_online = data.is_online;
    this.last_seen = data.last_seen;
    this.port = data.port;
    this.users = data.users.map((user) => new UserModel(user));
  }
}
