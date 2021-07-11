import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  headers: HttpHeaders;
  loadingCount = 0;

  constructor(
    protected http: HttpClient,
    protected spinner: NgxSpinnerService,
  ) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', `application/json`);
  }

  public startLoading(): void {
    if (this.loadingCount === 0) {
      this.spinner.show();
    }

    this.loadingCount ++;
  }

  public finishLoading(): void {
    this.loadingCount --;

    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.spinner.hide();
    }
  }

  protected get(url, params = {}, hasSpinner = true, headers = {}): Observable<any> {
    if (hasSpinner)
      this.startLoading();

    return new Observable((observer) => {
      this.http.get<any>(url, {headers, params}).subscribe(response => {
        if (hasSpinner)
          this.finishLoading();

        observer.next(response);
        observer.complete();
      }, error => {
        if (hasSpinner)
          this.finishLoading();

        observer.error(error);
        observer.complete();
      });
    });
  }

  protected post(url, body, hasSpinner = true, headers = {}): Observable<any> {
    if (hasSpinner)
      this.startLoading();


    return new Observable(observer => {
      this.http.post<any>(url, body, {headers}).subscribe(response => {
        if (hasSpinner)
          this.finishLoading();

        observer.next(response);
        observer.complete();
      }, error => {
        if (hasSpinner)
          this.finishLoading();

        observer.error(error);
        observer.complete();
      });
    });
  }

  protected put(url, body, hasSpinner = true, headers = {}): Observable<any> {
    if (hasSpinner)
      this.startLoading();


    return new Observable(observer => {
      this.http.put<any>(url, body, {headers}).subscribe(response => {
        if (hasSpinner)
          this.finishLoading();

        observer.next(response);
        observer.complete();
      }, error => {
        if (hasSpinner)
          this.finishLoading();

        observer.error(error);
        observer.complete();
      });
    });
  }

  protected delete(url, body = {}, hasSpinner = true, headers = {}): Observable<any> {
    if (hasSpinner)
      this.startLoading();

    return new Observable(observer => {
      this.http.request('delete', url, {headers, body}).subscribe(response => {
        if (hasSpinner)
          this.finishLoading();

        observer.next(response);
        observer.complete();
      }, error => {
        if (hasSpinner)
          this.finishLoading();

        observer.error(error);
        observer.complete();
      });
    });
  }

  protected request(method, url, options = {}, hasSpinner = true): Observable<any> {
    if (hasSpinner)
      this.startLoading();

    return new Observable(observer => {
      this.http.request<any>(method, url, options).subscribe(response => {
        if (hasSpinner)
          this.finishLoading();

        observer.next(response);
        observer.complete();
      }, error => {
        if (hasSpinner)
          this.finishLoading();

        observer.error(error);
        observer.complete();
      });
    });
  }
}
