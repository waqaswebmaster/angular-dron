import {Injectable} from '@angular/core';
import {AuthService} from "@services/auth.service";
import {CookieService} from "ngx-cookie-service";
import {MetaDataService} from "@services/meta-data.service";
import {environment} from "@env";

@Injectable()
export class Preloader {
  constructor(
    protected authSrv: AuthService,
    protected cookieSrv: CookieService,
    protected metaDataSrv: MetaDataService,
  ) {
  }

  public async init(): Promise<any> {
    const token = this.cookieSrv.get(environment.COOKIE_TOKEN);
    if (token) {
      this.authSrv.token = token;
      await this.authSrv.me( token, false).toPromise();
    }

    await this.metaDataSrv.loadMetaData().toPromise();
  }
}
