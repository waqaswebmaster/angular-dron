import {IMission} from "@app/types";
import {UserModel} from "@models/user.model";
import {MissionActionModel} from "@models/mission-action.model";
import {formatDistance, formatDuration} from "@shared/helpers/common";

export class MissionModel {
  id: number;
  thumbnail?: string;
  uuid: string;
  name: string;
  owner: UserModel;
  mission: {
    actions: MissionActionModel[],
    defaultFrame: string;
    creationTime: string;
    defaultAngle: number;
    defaultAngleOfView: number[];
    defaultCameraName: string;
    defaultCameraResolution: number[];
    defaultAltitude: number;
    defaultDelay: number;
    defaultDistance: number;
    defaultHeading: number;
    defaultOverlap: number;
    defaultRadius: number;
    defaultSpeed: number;
    defaultWidth: number;
    home: {
      coordinate: number[];
      version: number
    };
    name: string;
    rallys: any[];
    version: number;
  };
  waypoints: number;
  distance: number;
  duration: number;
  lat: string;
  lon: string;
  created_at: string;
  updated_at: string;

  distance_text: string;
  duration_text: string;

  constructor(init?: IMission) {
    const data = {
      id: null,
      thumbnail: '',
      uuid: '',
      name: '',
      mission: null,
      waypoints: null,
      distance: null,
      duration: null,
      lat: '',
      lon: '',
      created_at: '',
      updated_at: '',
      ...init,
    };

    this.id = data.id;
    this.thumbnail = data.thumbnail;
    this.uuid = data.uuid;
    this.name = data.name;
    this.mission = data.mission;
    this.waypoints = data.waypoints;
    this.distance = data.distance;
    this.duration = data.duration;
    this.lat = data.lat;
    this.lon = data.lon;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;

    if (data.owner)
      this.owner = new UserModel(data.owner);

    this.distance_text = formatDistance(data.distance);
    this.duration_text = formatDuration(data.duration);
  }
}
