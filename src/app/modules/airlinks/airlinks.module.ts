import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '@shared/shared.module';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbInputModule,
  NbSelectModule,
  NbTabsetModule,
  NbTagModule
} from "@nebular/theme";
import {AirLinksComponent} from '@modules/airlinks/components/airlinks/airlinks.component';
import {AirLinksRoutingModule} from '@modules/airlinks/airlinks.routing.module';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {AirLinkDetailComponent} from "@modules/airlinks/components/airlink-detail/airlink-detail.component";
import {AirLinkInfoTabComponent} from "@modules/airlinks/components/airlink-info-tab/airlink-info-tab.component";
import {AirLinkEditTabComponent} from "@modules/airlinks/components/airlink-edit-tab/airlink-edit-tab.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AirlinkAccessTabComponent} from "@modules/airlinks/components/airlink-access-tab/airlink-access-tab.component";
import {AirlinkSessionsTabComponent} from "@modules/airlinks/components/airlink-sessions-tab/airlink-sessions-tab.component";
import {AirlinkOwnersTabComponent} from "@modules/airlinks/components/airlink-owners-tab/airlink-owners-tab.component";

@NgModule({
  declarations: [
    AirLinksComponent,
    AirLinkDetailComponent,
    AirLinkInfoTabComponent,
    AirLinkEditTabComponent,
    AirlinkAccessTabComponent,
    AirlinkSessionsTabComponent,
    AirlinkOwnersTabComponent,
  ],
  imports: [
    CommonModule,
    AirLinksRoutingModule,
    SharedModule,
    NbTagModule,
    MatTableModule,
    MatSortModule,
    NbButtonModule,
    NbCardModule,
    NbTabsetModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSelectModule,
    NbCheckboxModule,
    FormsModule,
  ],
  providers: [],
})
export class AirLinksModule {
}
