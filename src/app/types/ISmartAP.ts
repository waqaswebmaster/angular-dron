import {ILog, IUser} from "@app/types";

export interface ISmartAP {
  uuid_ap: string;
  name: string;
  owner: IUser;
  created: string;
  platform: string;
  hardware: string;
  software: string;
  is_online: boolean;
  last_seen: string;
  vehicle_type: string;
  vehicle_type_name?: string;
  status: string;
  status_name?: string;
  flight: number;
  flights_duration: string;
  users: IUser[];
  logs: ILog[];
  can_edit: boolean;
  can_change_owner: boolean;
  can_change_users: boolean;
}
