import {IUser} from "@app/types";

export interface ISmartLink {
  uuid_link: string;
  name: string;
  owner: IUser;
  created: string;
  ip_address: string;
  software: string;
  is_online: boolean;
  last_seen: string;
  port: number;
  users: IUser[];
}
