import {IActivity, ICountry, IMetaData} from "@app/types";

export class MetaDataModel {
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

  constructor(init: IMetaData) {
    const data = {
      accesses: {},
      sizes: {},
      languages: {},
      activities: [],
      countries: [],
      ...init,
    };

    this.accesses = data.accesses;
    this.sizes = data.sizes;
    this.languages = data.languages;
    this.activities = data.activities;
    this.countries = data.countries;
  }
}
