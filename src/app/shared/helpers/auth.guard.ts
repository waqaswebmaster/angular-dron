import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "@services/auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    protected router: Router,
    protected authSrv: AuthService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (this.authSrv.user)
      return true;

    return this.router.parseUrl('/login');

    // return new Observable((observer) => {
    //   this.storeSrv.reloadUserInfo().subscribe(() => {
    //     observer.next(true);
    //     observer.complete();
    //   }, () => {
    //     observer.next(this.router.parseUrl('/sign-in'));
    //     observer.complete();
    //   });
    // });
  }
}
