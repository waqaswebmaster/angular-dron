import {IAirLink} from "@app/types";
import {UserModel} from "@models/user.model";

export class AirLinkModel {
  uuid_ap: string;
  uuid_link: string;
  name: string;
  owner: UserModel;
  created: string;
  ip_address: string;
  port: number;
  software: string;
  is_online: boolean;
  last_seen: string;
  ap_architecture: string;
  ap_hardware: string;
  ap_software_version: string;
  ap_software_git_hash: string;
  link_architecture: string;
  link_hardware: string;
  link_software_version: string;
  link_software_git_hash: string;
  users: UserModel[];

  constructor(init: IAirLink) {
    const data = {
      uuid_ap: '',
      uuid_link: '',
      name: '',
      created: '',
      ip_address: '',
      port: null,
      software: '',
      is_online: false,
      last_seen: '',
      ap_architecture: '',
      ap_hardware: '',
      ap_software_version: '',
      ap_software_git_hash: '',
      link_architecture: '',
      link_hardware: '',
      link_software_version: '',
      link_software_git_hash: '',
      users: [],
      ...init,
    };

    this.uuid_ap = data.uuid_ap;
    this.uuid_link = data.uuid_link;
    this.name = data.name;
    this.owner = new UserModel(data.owner);
    this.created = data.created;
    this.ip_address = data.ip_address;
    this.port = data.port;
    this.software = data.software;
    this.is_online = data.is_online;
    this.last_seen = data.last_seen;
    this.ap_architecture = data.ap_architecture;
    this.ap_hardware = data.ap_hardware;
    this.ap_software_version = data.ap_software_version;
    this.ap_software_git_hash = data.ap_software_git_hash;
    this.link_architecture = data.link_architecture;
    this.link_hardware = data.link_hardware;
    this.link_software_version = data.link_software_version;
    this.link_software_git_hash = data.link_software_git_hash;
    this.users = data.users.map((user) => new UserModel(user));
  }
}
