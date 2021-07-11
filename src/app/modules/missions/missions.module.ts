import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '@shared/shared.module';
import {NbButtonModule, NbCardModule, NbTagModule} from "@nebular/theme";
import {MissionsComponent} from '@modules/missions/components/missions/missions.component';
import {MissionsRoutingModule} from '@modules/missions/missions.routing.module';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatMenuModule} from "@angular/material/menu";
import {MissionFormComponent} from "@modules/missions/components/mission-form/mission-form.component";

@NgModule({
  declarations: [
    MissionsComponent,
    MissionFormComponent,
  ],
  imports: [
    CommonModule,
    MissionsRoutingModule,
    SharedModule,
    NbTagModule,
    MatTableModule,
    MatSortModule,
    NbButtonModule,
    MatMenuModule,
    NbCardModule,
  ],
  providers: [],
})
export class MissionsModule {
}
