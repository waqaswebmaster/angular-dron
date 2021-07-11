import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardComponent} from '@modules/dashboard/dashboard.component';
import {DashboardRoutingModule} from '@modules/dashboard/dashboard.routing.module';
import {SharedModule} from '@shared/shared.module';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbSelectModule,
} from "@nebular/theme";

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NbIconModule,
    NbButtonModule,
    NbCardModule,
    NbSelectModule,
  ],
  providers: [],
})
export class DashboardModule {
}
