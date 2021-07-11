export interface IFeature {
  id: string;
  name: string;
  description?: string;
  service_name: string;
  trial_period: number;
  monthly_fee: number;
  yearly_fee: number;
  available: boolean;
}
