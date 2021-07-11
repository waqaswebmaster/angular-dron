import {IActivity} from "./IActivity";
import {ICountry} from "./ICountry";

export interface IMetaData {
  accesses: {
    [key: string]: string;
  };
  sizes: {
    [key: string]: string;
  };
  languages: {
    [key: string]: string;
  };
  activities: IActivity[];
  countries: ICountry[];
}
