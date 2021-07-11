import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "@env";
import {ApiService} from "@services/api.service";
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {MetaDataModel} from "@app/models";
import {IAccess, ILanguage, ISize, IState} from "@app/types";

@Injectable({
  providedIn: 'root'
})
export class MetaDataService extends ApiService {

  metaData: MetaDataModel;

  constructor(
    protected http: HttpClient,
    protected spinner: NgxSpinnerService,
  ) {
    super(http, spinner);
  }

  loadMetaData(hasSpinner = true): Observable<MetaDataModel> {
    return new Observable(observer => {
      this.get(`${environment.API_SERVER}/webapp/meta/`, {}, hasSpinner).subscribe(response => {
        this.metaData = new MetaDataModel(response);
        observer.next(this.metaData);
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  getStatesFromCountryId(countryId: number, hasSpinner = true): Observable<IState[]> {
    return new Observable(observer => {
      this.get(`${environment.API_SERVER}/webapp/meta/states/`, { country: countryId }, hasSpinner).subscribe(response => {
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  getCountryName(countryId: number): string {
    return this.metaData.countries.find((item) => item.id === countryId)?.name;
  }

  getActivityName(activityId: number): string {
    return this.metaData.activities.find((item) => item.id === activityId)?.name;
  }

  getSizeText(id: number): string {
    return this.metaData.sizes[id];
  }

  getSizeList(): ISize[] {
    return Object.keys(this.metaData.sizes).map((id) => ({
      id: Number(id),
      text: this.metaData.sizes[id],
    }));
  }

  getAccessName(id: number): string {
    return this.metaData.accesses[id];
  }

  getAccessList(): IAccess[] {
    return Object.keys(this.metaData.accesses).map((id) => ({
      id: Number(id),
      name: this.metaData.accesses[id],
    }));
  }

  getLanguageName(code: string): string {
    return this.metaData.languages[code];
  }

  getLanguageList(): ILanguage[] {
    return Object.keys(this.metaData.languages).map((code) => ({
      code,
      name: this.metaData.languages[code],
    }));
  }
}
