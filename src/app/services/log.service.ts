import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "@env";
import {ApiService} from "@services/api.service";
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {LogModel} from "@app/models";

@Injectable({
  providedIn: 'root'
})
export class LogService extends ApiService {

  constructor(
    protected http: HttpClient,
    protected spinner: NgxSpinnerService,
  ) {
    super(http, spinner);
  }

  search(filter: Object = {}, hasSpinner = true): Observable<any> {
    return new Observable(observer => {
      this.get(`${environment.API_SERVER}/log/`, filter, hasSpinner).subscribe(response => {
        observer.next({
          ...response,
          results: response.results.map((item) => new LogModel(item)),
        });
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }
}
