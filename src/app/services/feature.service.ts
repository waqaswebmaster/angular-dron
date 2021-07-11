import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "@env";
import {ApiService} from "@services/api.service";
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {FeatureModel} from "@app/models";

@Injectable({
  providedIn: 'root'
})
export class FeatureService extends ApiService {

  constructor(
    protected http: HttpClient,
    protected spinner: NgxSpinnerService,
  ) {
    super(http, spinner);
  }

  search(filter: Object = {}, hasSpinner = true): Observable<any> {
    return new Observable(observer => {
      const features = [
        { id: 1, name: 'Flight recordings access', service_name: 'ALLTIME_VIDEO', trial_period: 0, monthly_fee: 1000, yearly_fee: 10000 },
        { id: 2, name: 'Flight recordings access', service_name: 'ALLTIME_VIDEO', trial_period: 0, monthly_fee: 1000, yearly_fee: 10000 },
        { id: 3, name: 'Flight recordings access', service_name: 'ALLTIME_VIDEO', trial_period: 0, monthly_fee: 1000, yearly_fee: 10000 },
        { id: 4, name: 'Flight recordings access', service_name: 'ALLTIME_VIDEO', trial_period: 0, monthly_fee: 1000, yearly_fee: 10000 },
        { id: 5, name: 'Flight recordings access', service_name: 'ALLTIME_VIDEO', trial_period: 0, monthly_fee: 1000, yearly_fee: 10000 },
        { id: 6, name: 'Flight recordings access', service_name: 'ALLTIME_VIDEO', trial_period: 0, monthly_fee: 1000, yearly_fee: 10000 },
        { id: 7, name: 'Flight recordings access', service_name: 'ALLTIME_VIDEO', trial_period: 0, monthly_fee: 1000, yearly_fee: 10000 },
        { id: 8, name: 'Flight recordings access', service_name: 'ALLTIME_VIDEO', trial_period: 0, monthly_fee: 1000, yearly_fee: 10000 },
        { id: 9, name: 'Flight recordings access', service_name: 'ALLTIME_VIDEO', trial_period: 0, monthly_fee: 1000, yearly_fee: 10000 },
        { id: 10, name: 'Flight recordings access', service_name: 'ALLTIME_VIDEO', trial_period: 0, monthly_fee: 1000, yearly_fee: 10000 },
      ];
      observer.next({
        count: 65,
        results: features,
      });
      observer.complete();

      this.get(`${environment.API_SERVER}/features/`, filter, hasSpinner).subscribe(response => {
        observer.next({
          ...response,
          results: response.results.map((item) => new FeatureModel(item)),
        });
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }
}
