import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '@shared/shared.module';
import {NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbTabsetModule, NbTagModule} from "@nebular/theme";
import {SmartLinksComponent} from '@modules/smartlinks/components/smartlinks/smartlinks.component';
import {SmartLinksRoutingModule} from '@modules/smartlinks/smartlinks.routing.module';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {SmartLinkDetailComponent} from "@modules/smartlinks/components/smartlink-detail/smartlink-detail.component";
import {SmartLinkInfoTabComponent} from "@modules/smartlinks/components/smartlink-info-tab/smartlink-info-tab.component";
import {SmartLinkEditTabComponent} from "@modules/smartlinks/components/smartlink-edit-tab/smartlink-edit-tab.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SmartlinkAccessTabComponent} from "@modules/smartlinks/components/smartlink-access-tab/smartlink-access-tab.component";
import {SmartlinkSessionsTabComponent} from "@modules/smartlinks/components/smartlink-sessions-tab/smartlink-sessions-tab.component";

@NgModule({
  declarations: [
    SmartLinksComponent,
    SmartLinkDetailComponent,
    SmartLinkInfoTabComponent,
    SmartLinkEditTabComponent,
    SmartlinkAccessTabComponent,
    SmartlinkSessionsTabComponent,
  ],
  imports: [
    CommonModule,
    SmartLinksRoutingModule,
    SharedModule,
    NbTagModule,
    MatTableModule,
    MatSortModule,
    NbButtonModule,
    NbCardModule,
    NbTabsetModule,
    NbInputModule,
    ReactiveFormsModule,
    NbSelectModule,
    FormsModule,
  ],
  providers: [],
})
export class SmartLinksModule {
}
