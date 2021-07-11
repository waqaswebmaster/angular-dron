import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "@env";
import {ApiService} from "@services/api.service";
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {SmartAPModel} from "@app/models";
import {ISmartAP} from "@app/types";

@Injectable({
  providedIn: 'root'
})
export class SmartAPService extends ApiService {

  constructor(
    protected http: HttpClient,
    protected spinner: NgxSpinnerService,
  ) {
    super(http, spinner);
  }

  search(filter: Object = {}, hasSpinner = true): Observable<any> {
    return new Observable(observer => {
      this.get(`${environment.API_SERVER}/smartaps/`, filter, hasSpinner).subscribe(response => {
        observer.next({
          ...response,
          results: response.results.map((item) => new SmartAPModel(item)),
        });
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  find(uuid: string, hasSpinner = true): Observable<SmartAPModel> {
    return new Observable(observer => {
      this.get(`${environment.API_SERVER}/smartaps/${uuid}/`, {}, hasSpinner).subscribe(response => {
        observer.next(new SmartAPModel(response));
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  update(uuid: string, data: any, hasSpinner = true): Observable<ISmartAP> {
    return new Observable(observer => {
      this.put(`${environment.API_SERVER}/smartaps/${uuid}/`, data, hasSpinner).subscribe(response => {
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }
}
