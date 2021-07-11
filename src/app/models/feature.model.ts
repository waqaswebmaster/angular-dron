import {IFeature} from "@app/types";

export class FeatureModel {
  id: string;
  name: string;
  description: string;
  service_name: string;
  trial_period: number;
  monthly_fee: number;
  yearly_fee: number;
  available: boolean;

  constructor(init: IFeature) {
    const data = {
      id: '',
      name: '',
      description: '',
      service_name: '',
      trial_period: 0,
      monthly_fee: null,
      yearly_fee: null,
      available: true,
      ...init,
    };

    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.service_name = data.service_name;
    this.trial_period = data.trial_period;
    this.monthly_fee = data.monthly_fee;
    this.yearly_fee = data.yearly_fee;
    this.available = data.available;
  }
}
