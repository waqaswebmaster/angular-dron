import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "@env";
import {ApiService} from "@services/api.service";
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {OrganisationModel} from "@app/models";
import {IOrganisation} from "@app/types";

@Injectable({
  providedIn: 'root'
})
export class OrganisationService extends ApiService {

  constructor(
    protected http: HttpClient,
    protected spinner: NgxSpinnerService,
  ) {
    super(http, spinner);
  }

  search(filter: Object = {}, hasSpinner = true): Observable<any> {
    return new Observable(observer => {
      this.get(`${environment.API_SERVER}/webapp/organisations/`, filter, hasSpinner).subscribe(response => {
        observer.next({
          ...response,
          results: response.results.map((item) => new OrganisationModel(item)),
        });
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  find(id: number, hasSpinner = true): Observable<OrganisationModel> {
    return new Observable(observer => {
      this.get(`${environment.API_SERVER}/webapp/organisations/${id}/`, {}, hasSpinner).subscribe(response => {
        observer.next(new OrganisationModel(response));
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  create(data: any, hasSpinner = true): Observable<IOrganisation> {
    return new Observable(observer => {
      this.post(`${environment.API_SERVER}/webapp/organisations/`, data, hasSpinner).subscribe(response => {
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  update(id: number, data: any, hasSpinner = true): Observable<IOrganisation> {
    return new Observable(observer => {
      this.put(`${environment.API_SERVER}/webapp/organisations/${id}/`, data, hasSpinner).subscribe(response => {
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  remove(id: number, hasSpinner = true): Observable<void> {
    return new Observable(observer => {
      this.delete(`${environment.API_SERVER}/webapp/organisations/${id}/`, {}, hasSpinner).subscribe(() => {
        observer.next();
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
      this.post(`${environment.API_SERVER}/webapp/organisations/${id}/upload_photo/`, formData, hasSpinner).subscribe(response => {
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
      this.post(`${environment.API_SERVER}/webapp/organisations/${id}/remove_photo/`, {}, hasSpinner).subscribe(() => {
        observer.next();
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }
}
