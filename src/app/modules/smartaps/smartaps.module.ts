import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '@shared/shared.module';
import {
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbTabsetModule,
  NbTagModule
} from "@nebular/theme";
import {SmartAPsComponent} from '@modules/smartaps/components/smartaps/smartaps.component';
import {SmartAPsRoutingModule} from '@modules/smartaps/smartaps.routing.module';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {SmartAPDetailComponent} from "@modules/smartaps/components/smartap-detail/smartap-detail.component";
import {SmartAPInfoTabComponent} from "@modules/smartaps/components/smartap-info-tab/smartap-info-tab.component";
import {SmartAPEditTabComponent} from "@modules/smartaps/components/smartap-edit-tab/smartap-edit-tab.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    SmartAPsComponent,
    SmartAPDetailComponent,
    SmartAPInfoTabComponent,
    SmartAPEditTabComponent,
  ],
  imports: [
    CommonModule,
    SmartAPsRoutingModule,
    SharedModule,
    NbTagModule,
    MatTableModule,
    MatSortModule,
    NbCardModule,
    NbTabsetModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbAutocompleteModule,
    FormsModule,
  ],
  providers: [],
})
export class SmartAPsModule {
}
