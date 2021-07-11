import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersComponent} from '@modules/users/components/users/users.component';
import {UsersRoutingModule} from '@modules/users/users.routing.module';
import {SharedModule} from '@shared/shared.module';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbTabsetModule,
  NbTagModule,
  NbTooltipModule,
} from "@nebular/theme";
import {UserDetailComponent} from "@modules/users/components/user-detail/user-detail.component";
import {UserProfileTabComponent} from "@modules/users/components/user-profile-tab/user-profile-tab.component";
import {UserActivitiesTabComponent} from "@modules/users/components/user-activities-tab/user-activities-tab.component";
import {UserEditTabComponent} from "@modules/users/components/user-edit-tab/user-edit-tab.component";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {UserBillingTabComponent} from "@modules/users/components/user-billing-tab/user-billing-tab.component";
import {NgxMaskModule} from "ngx-mask";
import {UserFeaturesTabComponent} from "@modules/users/components/user-features-tab/user-features-tab.component";

@NgModule({
  declarations: [
    UsersComponent,
    UserDetailComponent,
    UserProfileTabComponent,
    UserActivitiesTabComponent,
    UserEditTabComponent,
    UserBillingTabComponent,
    UserFeaturesTabComponent,
  ],
  exports: [
    UserProfileTabComponent,
    UserActivitiesTabComponent,
    UserEditTabComponent,
    UserBillingTabComponent,
    UserFeaturesTabComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    NbTabsetModule,
    NbCardModule,
    NbTagModule,
    ReactiveFormsModule,
    NbSelectModule,
    NgxIntlTelInputModule,
    MatTableModule,
    MatSortModule,
    NgxMaskModule.forRoot(),
    NbCheckboxModule,
    NbAlertModule,
    NbTooltipModule,
  ],
  providers: [],
})
export class UsersModule {
}
