import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FullLayoutComponent} from './full-layout/full-layout.component';
import {AuthLayoutComponent} from './auth-layout/auth-layout.component';
import {NbLayoutModule, NbMenuModule} from "@nebular/theme";
import {ThemeModule} from "@theme/theme.module";

@NgModule({
  declarations: [
    FullLayoutComponent,
    AuthLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ThemeModule,
    NbMenuModule,
    NbLayoutModule,
  ]
})
export class LayoutModule {
}
