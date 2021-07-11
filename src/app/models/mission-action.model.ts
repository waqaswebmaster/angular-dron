import {IMissionAction} from "@app/types";

export class MissionActionModel {
  command: string;
  coordinate: number[];
  delay: number;
  elevation: number;
  frame: string;
  heading: number;
  radius: number;
  speed: number;
  type: string;
  version: number;

  constructor(init: IMissionAction) {
    const data = {
      command: '',
      coordinate: [],
      delay: null,
      elevation: null,
      frame: '',
      heading: null,
      radius: null,
      speed: null,
      type: '',
      version: null,
      ...init,
    };

    this.command = data.command;
    this.coordinate = data.coordinate;
    this.delay = data.delay;
    this.elevation = data.elevation;
    this.frame = data.frame;
    this.heading = data.heading;
    this.radius = data.radius;
    this.speed = data.speed;
    this.type = data.type;
    this.version = data.version;
  }
}
