import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "@services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    protected authSrv: AuthService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authSrv.token;
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `TOKEN ${token}`,
        }
      });
    }

    return next.handle(request);
  }
}
