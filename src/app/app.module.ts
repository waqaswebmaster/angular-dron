import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from '@app/app.component';
import {AppRoutingModule} from '@app/app.routing.module';
import {LayoutModule} from '@app/layout/layout.module';
import {SharedModule} from '@shared/shared.module';
import {JwtInterceptor} from '@shared/helpers/jwt.interceptor';
import {ErrorInterceptor} from '@shared/helpers/error.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule
} from "@nebular/theme";
import {ThemeModule} from "@theme/theme.module";
import {AuthService} from "@services/auth.service";
import {NgxSpinnerModule} from "ngx-spinner";
import {Preloader} from "@shared/helpers/preloader";
import {ApiService} from "@services/api.service";
import {UserService} from "@services/user.service";
import {SmartAPService} from "@services/smartap.service";
import {SmartLinkService} from "@services/smartlink.service";
import {AirLinkService} from "@services/airlink.service";
import {CookieService} from "ngx-cookie-service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,
    SharedModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    ThemeModule.forRoot(),
    NgxSpinnerModule,
  ],
  providers: [
    Preloader,
    {
      provide: APP_INITIALIZER,
      useFactory: (provider: Preloader) => {
        return () => provider.init();
      },
      deps: [Preloader],
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    ApiService,
    AuthService,
    UserService,
    SmartAPService,
    SmartLinkService,
    AirLinkService,
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
