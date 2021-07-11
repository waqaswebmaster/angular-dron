import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "@env";
import {ApiService} from "@services/api.service";
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {MissionModel} from "@app/models";

@Injectable({
  providedIn: 'root'
})
export class MissionService extends ApiService {

  constructor(
    protected http: HttpClient,
    protected spinner: NgxSpinnerService,
  ) {
    super(http, spinner);
  }

  search(filter: Object = {}, hasSpinner = true): Observable<any> {
    return new Observable(observer => {
      this.get(`${environment.API_SERVER}/missions/`, filter, hasSpinner).subscribe(response => {
        observer.next({
          ...response,
          results: response.results.map((item) => new MissionModel(item)),
        });
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  find(uuid: string, hasSpinner = true): Observable<MissionModel> {
    return new Observable(observer => {
      this.get(`${environment.API_SERVER}/missions/${uuid}/`, {}, hasSpinner).subscribe(response => {
        observer.next(new MissionModel(response));
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  create(data: any, hasSpinner = true): Observable<MissionModel> {
    return new Observable(observer => {
      this.post(`${environment.API_SERVER}/missions/`, data, hasSpinner).subscribe(response => {
        observer.next(new MissionModel(response));
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  update(uuid: string, data: any, hasSpinner = true): Observable<MissionModel> {
    return new Observable(observer => {
      this.put(`${environment.API_SERVER}/missions/${uuid}/`, data, hasSpinner).subscribe(response => {
        observer.next(new MissionModel(response));
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  remove(uuid: string, hasSpinner = true): Observable<void> {
    return new Observable(observer => {
      this.delete(`${environment.API_SERVER}/missions/${uuid}/`, hasSpinner).subscribe(() => {
        observer.next();
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }
}
