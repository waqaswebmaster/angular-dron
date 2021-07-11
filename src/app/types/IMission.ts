import {IMissionAction, IUser} from "@app/types";

export interface IMission {
  id: number;
  thumbnail?: string;
  uuid: string;
  name: string;
  owner: IUser;
  mission: {
    actions: IMissionAction[],
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
}
