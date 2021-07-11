import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "@env";
import {ApiService} from "@services/api.service";
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {ManufacturerModel} from "@app/models";

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService extends ApiService {

  constructor(
    protected http: HttpClient,
    protected spinner: NgxSpinnerService,
  ) {
    super(http, spinner);
  }

  search(filter: Object = {}, hasSpinner = true): Observable<any> {
    return new Observable(observer => {
      const manufacturers = [
        { id: 1, name: 'Krill Shilov', photo: 'assets/images/jack.png', email: 'krill@sky-drones.com', limit: 5, value: 'Claimed: 2' },
        { id: 2, name: 'Grigory Lazurin', email: 'grigory@sky-drones.com', limit: 50, value: 'Claimed: 1' },
        { id: 3, name: 'Grigory Lazurin', email: 'grigory@sky-drones.com', limit: 50, value: 'Claimed: 1' },
        { id: 4, name: 'Grigory Lazurin', email: 'grigory@sky-drones.com', limit: 50, value: 'Claimed: 1' },
        { id: 5, name: 'Grigory Lazurin', email: 'grigory@sky-drones.com', limit: 50, value: 'Claimed: 1' },
        { id: 6, name: 'Grigory Lazurin', email: 'grigory@sky-drones.com', limit: 50, value: 'Claimed: 1' },
        { id: 7, name: 'Grigory Lazurin', email: 'grigory@sky-drones.com', limit: 50, value: 'Claimed: 1' },
        { id: 8, name: 'Grigory Lazurin', email: 'grigory@sky-drones.com', limit: 50, value: 'Claimed: 1' },
        { id: 9, name: 'Grigory Lazurin', email: 'grigory@sky-drones.com', limit: 50, value: 'Claimed: 1' },
        { id: 10, name: 'Grigory Lazurin', email: 'grigory@sky-drones.com', limit: 50, value: 'Claimed: 1' },
      ];
      observer.next({
        count: 65,
        results: manufacturers,
      });
      observer.complete();

      this.get(`${environment.API_SERVER}/manufacturers/`, filter, hasSpinner).subscribe(response => {
        observer.next({
          ...response,
          results: response.results.map((item) => new ManufacturerModel(item)),
        });
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }
}
