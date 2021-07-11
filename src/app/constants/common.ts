import {CountryISO} from "ngx-intl-tel-input";

export const FLIGHT_TYPES = {
  1: 'Commercial',
  2: 'Training',
  3: 'Test',
};

export const OPERATION_TYPES = {
  1: 'Visual',
  2: 'EVLOS',
  3: 'BVLOS',
};

export const RATINGS = {
  4: 'Visual',
  3: 'Good',
  2: 'Satisfied',
  1: 'Bad',
  '-1': 'Crash (system error)',
  '-2': 'Crash (pilot error)',
};

export const WIND_SPEEDS = {
  1: 'Calm',
  2: 'Breeze',
  3: 'Gale',
  4: 'Storm',
};

export const PREFERRED_COUNTRIES = [
  CountryISO.UnitedKingdom,
  CountryISO.Ireland,
  CountryISO.UnitedStates,
  CountryISO.Canada,
];
