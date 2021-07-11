import {ISmartAP} from "@app/types";
import {UserModel} from "@models/user.model";
import {LogModel} from "@models/log.model";

export class SmartAPModel {
  uuid_ap: string;
  name: string;
  owner: UserModel;
  created: string;
  platform: string;
  hardware: string;
  software: string;
  is_online: boolean;
  last_seen: string;
  vehicle_type: string;
  vehicle_type_name: string;
  status: string;
  status_name: string;
  flight: number;
  flights_duration: string;
  users: UserModel[];
  logs: LogModel[];
  can_edit: boolean;
  can_change_owner: boolean;
  can_change_users: boolean;

  constructor(init: ISmartAP) {
    const data = {
      uuid_ap: '',
      name: '',
      created: '',
      platform: '',
      hardware: '',
      software: '',
      is_online: false,
      last_seen: '',
      vehicle_type: '',
      vehicle_type_name: '',
      status: '',
      status_name: '',
      flight: 0,
      flights_duration: '',
      users: [],
      logs: [],
      can_edit: false,
      can_change_owner: false,
      can_change_users: false,
      ...init,
    };

    this.uuid_ap = data.uuid_ap;
    this.name = data.name;
    this.owner = new UserModel(data.owner);
    this.created = data.created;
    this.platform = data.platform;
    this.hardware = data.hardware;
    this.software = data.software;
    this.is_online = data.is_online;
    this.last_seen = data.last_seen;
    this.vehicle_type = data.vehicle_type;
    this.vehicle_type_name = data.vehicle_type_name;
    this.status = data.status;
    this.status_name = data.status_name;
    this.flight = data.flight;
    this.flights_duration = data.flights_duration;
    this.users = data.users.map((user) => new UserModel(user));
    this.logs = data.logs.map((log) => new LogModel(log));
    this.can_edit = data.can_edit;
    this.can_change_owner = data.can_change_owner;
    this.can_change_users = data.can_change_users;
  }
}
