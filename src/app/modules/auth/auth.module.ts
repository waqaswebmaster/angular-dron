import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReactiveFormsModule} from '@angular/forms';
import {AuthRoutingModule} from '@modules/auth/auth.routing.module';
import {SharedModule} from '@shared/shared.module';
import {LoginComponent} from "@modules/auth/components/login/login.component";
import {NbButtonModule, NbCardModule, NbCheckboxModule, NbInputModule} from "@nebular/theme";

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NbCardModule,
    NbInputModule,
    NbCheckboxModule,
    NbButtonModule,
  ],
  providers: [],
})
export class AuthModule {
}
