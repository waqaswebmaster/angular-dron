import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserModel} from "@app/models";
import {environment} from "@env";
import {ApiService} from "@services/api.service";
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  private userSubject = new BehaviorSubject<UserModel>(null);
  public userObserver = this.userSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string>(undefined);
  public tokenObserver = this.tokenSubject.asObservable();

  public get user(): UserModel {
    return this.userSubject.value;
  }
  public set user(value: UserModel) {
    this.userSubject.next(value);
  }

  public get token(): string {
    return this.tokenSubject.value;
  }
  public set token(value: string) {
    this.tokenSubject.next(value);
  }

  constructor(
    protected http: HttpClient,
    protected spinner: NgxSpinnerService,
    protected cookieSrv: CookieService,
    protected router: Router,
  ) {
    super(http, spinner);

    this.tokenObserver.subscribe((newToken) => {
      if (newToken === undefined)
        return;

      if (!newToken) {
        this.cookieSrv.delete(environment.COOKIE_TOKEN, '/');
        return;
      }

      const token = this.cookieSrv.get(environment.COOKIE_TOKEN);
      if (token === newToken)
        return;

      const rememberMe = this.cookieSrv.get(environment.COOKIE_REMEMBER_ME) === 'true';
      this.cookieSrv.set(environment.COOKIE_TOKEN, newToken, rememberMe ? 1 : undefined, '/');

      this.me(newToken, false).subscribe();
    });
  }

  login(email: string, password: string, remember: boolean, hasSpinner = true): Observable<any> {
    this.cookieSrv.set(environment.COOKIE_REMEMBER_ME, String(remember), 100, '/');

    return new Observable(observer => {
      this.post(`${environment.API_SERVER}/auth/login/`, {email, password}, hasSpinner).subscribe(response => {
        this.token = response.key;
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  me(token: string, hasSpinner = true): Observable<any> {
    return new Observable(observer => {
      this.user = new UserModel({
        id: 1,
        full_name: 'Kamil Zaripov',
        photo: 'assets/images/jack.png',
        email: 'kamil@sky-drones.com',
        email_is_verified: false,
        date_joined: '2018-01-26 15:57:12',
        last_login: '2015-10-23 23:12:31'
      });

      observer.next(this.user);
      observer.complete();

      this.post(`${environment.API_SERVER}/auth/me/`, {token}, hasSpinner).subscribe(response => {
        this.user = new UserModel(response);
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  logout(): void {
    this.user = null;
    this.token = null;
    this.router.navigate(['/login']).then();
  }
}
