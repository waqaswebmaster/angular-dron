import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MyAccountComponent} from "@modules/my-account/my-account.component";
import {MyAccountRoutingModule} from "@modules/my-account/my-account.routing.module";
import {SharedModule} from '@shared/shared.module';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbTabsetModule,
  NbTagModule,
} from "@nebular/theme";
import {UsersModule} from "@modules/users/users.module";

@NgModule({
  declarations: [
    MyAccountComponent,
  ],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    SharedModule,
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    NbTabsetModule,
    NbCardModule,
    NbTagModule,
    NbSelectModule,
    UsersModule,
  ],
  providers: [],
})
export class MyAccountModule {
}
