import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserModel} from "@app/models";
import {environment} from "@env";
import {ApiService} from "@services/api.service";
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {

  constructor(
    protected http: HttpClient,
    protected spinner: NgxSpinnerService,
  ) {
    super(http, spinner);
  }

  search(filter: Object = {}, hasSpinner = true): Observable<any> {
    return new Observable(observer => {
      this.get(`${environment.API_SERVER}/users/`, filter, hasSpinner).subscribe(response => {
        if (Array.isArray(response)) {
          observer.next(response.map((item) => new UserModel(item)));
        } else {
          observer.next({
            ...response,
            results: response.results.map((item) => new UserModel(item)),
          });
        }
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  find(id: number, hasSpinner = true): Observable<UserModel> {
    return new Observable(observer => {
      this.get(`${environment.API_SERVER}/users/${id}/`, {}, hasSpinner).subscribe(response => {
        observer.next(new UserModel(response));
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  update(id: number, data: any = {}, hasSpinner = true): Observable<UserModel> {
    return new Observable(observer => {
      this.put(`${environment.API_SERVER}/users/${id}/`, data, hasSpinner).subscribe(response => {
        observer.next(new UserModel(response));
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  uploadPhoto(id: number, photo: File, hasSpinner = true): Observable<string> {
    const formData = new FormData();
    formData.append('photo', photo);

    return new Observable(observer => {
      this.post(`${environment.API_SERVER}/users/${id}/upload_photo/`, formData, hasSpinner).subscribe(response => {
        observer.next(response.url);
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  removePhoto(id: number, hasSpinner = true): Observable<void> {
    return new Observable(observer => {
      this.post(`${environment.API_SERVER}/users/${id}/remove_photo/`, {}, hasSpinner).subscribe(() => {
        observer.next();
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }
}
