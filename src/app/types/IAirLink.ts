import {IUser} from "@app/types";

export interface IAirLink {
  uuid_ap: string;
  uuid_link: string;
  name: string;
  owner: IUser;
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
  users: IUser[];
}
