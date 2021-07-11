import {ILog} from "@app/types";
import {UserModel} from "@models/user.model";
import {formatDuration} from "@shared/helpers/common";
import {FLIGHT_TYPES, OPERATION_TYPES, RATINGS, WIND_SPEEDS} from "@constants";

export class LogModel {
  uuid: string;
  datetime_of_start?: string;
  filename: string;
  parsing: number;
  duration?: number;
  drone?: {
    uuid_ap: string;
    name: string;
    type: string;
  };
  pilot: UserModel;
  users: UserModel[];
  hardware_name?: string;
  hardware_version?: string;
  software_version?: string;
  rating?: number;
  operation_type?: number;
  flight_type?: number;
  wind_speed?: number;
  location_lat?: number;
  location_lon?: number;
  travelled_distance?: number;
  ground_altitude?: number;
  max_agl_altitude?: number;
  max_distance_from_home?: number;
  max_speed?: number;
  average_speed?: number;
  average_speed_fw?: number;
  average_speed_mc?: number;
  battery_voltage_begin?: number;
  battery_voltage_end?: number;
  battery_max_current?: number;
  battery_average_current?: number;
  uploaded_at: string;
  description?: string;
  special_notes?: string;
  format?: string;
  sys_uuid?: string;
  estimator?: string;
  os_version?: string;
  max_alt_diff?: number;
  max_speed_down?: number;
  max_speed_h?: number;
  max_speed_up?: number;
  dropouts?: string;
  updated_at: string;
  dronelogbook_state?: string;
  dronelogbook_url?: string;
  dronelogbook_description?: string;

  duration_text: string;
  flight_type_text: string;
  operation_type_text: string;
  rating_text: string;
  wind_speed_text: string;

  constructor(init: ILog) {
    const data = {
      uuid: '',
      datetime_of_start: null,
      filename: '',
      parsing: 0,
      duration: null,
      drone: null,
      users: [],
      hardware_name: null,
      hardware_version: null,
      software_version: null,
      rating: null,
      operation_type: null,
      flight_type: null,
      wind_speed: null,
      location_lat: null,
      location_lon: null,
      travelled_distance: null,
      ground_altitude: null,
      max_agl_altitude: null,
      max_distance_from_home: null,
      max_speed: null,
      average_speed: null,
      average_speed_fw: null,
      average_speed_mc: null,
      battery_voltage_begin: null,
      battery_voltage_end: null,
      battery_max_current: null,
      battery_average_current: null,
      uploaded_at: '',
      description: null,
      special_notes: null,
      format: null,
      sys_uuid: null,
      estimator: null,
      os_version: null,
      max_alt_diff: null,
      max_speed_down: null,
      max_speed_h: null,
      max_speed_up: null,
      dropouts: null,
      updated_at: '',
      dronelogbook_state: null,
      dronelogbook_url: null,
      dronelogbook_description: null,
      ...init,
    };
    this.uuid = data.uuid;
    this.datetime_of_start = data.datetime_of_start;
    this.filename = data.filename;
    this.parsing = data.parsing;
    this.duration = data.duration;
    this.drone = data.drone;
    this.pilot = new UserModel(data.pilot);
    this.users = data.users.map((user) => new UserModel(user));
    this.hardware_name = data.hardware_name;
    this.hardware_version = data.hardware_version;
    this.software_version = data.software_version;
    this.rating = data.rating;
    this.operation_type = data.operation_type;
    this.flight_type = data.flight_type;
    this.wind_speed = data.wind_speed;
    this.location_lat = data.location_lat;
    this.location_lon = data.location_lon;
    this.travelled_distance = data.travelled_distance;
    this.ground_altitude = data.ground_altitude;
    this.max_agl_altitude = data.max_agl_altitude;
    this.max_distance_from_home = data.max_distance_from_home;
    this.max_speed = data.max_speed;
    this.average_speed = data.average_speed;
    this.average_speed_fw = data.average_speed_fw;
    this.average_speed_mc = data.average_speed_mc;
    this.battery_voltage_begin = data.battery_voltage_begin;
    this.battery_voltage_end = data.battery_voltage_end;
    this.battery_max_current = data.battery_max_current;
    this.battery_average_current = data.battery_average_current;
    this.uploaded_at = data.uploaded_at;
    this.description = data.description;
    this.special_notes = data.special_notes;
    this.format = data.format;
    this.sys_uuid = data.sys_uuid;
    this.estimator = data.estimator;
    this.os_version = data.os_version;
    this.max_alt_diff = data.max_alt_diff;
    this.max_speed_down = data.max_speed_down;
    this.max_speed_h = data.max_speed_h;
    this.max_speed_up = data.max_speed_up;
    this.dropouts = data.dropouts;
    this.updated_at = data.updated_at;
    this.dronelogbook_state = data.dronelogbook_state;
    this.dronelogbook_url = data.dronelogbook_url;
    this.dronelogbook_description = data.dronelogbook_description;

    this.duration_text = formatDuration(data.duration);
    this.rating_text = RATINGS[this.rating] ?? '-';
    this.flight_type_text = FLIGHT_TYPES[this.flight_type] ?? '-';
    this.operation_type_text = OPERATION_TYPES[this.operation_type] ?? '-';
    this.wind_speed_text = WIND_SPEEDS[this.wind_speed] ?? '-';
  }
}
