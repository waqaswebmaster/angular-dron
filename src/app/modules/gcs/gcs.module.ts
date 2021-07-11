import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GcsComponent} from '@modules/gcs/gcs.component';
import {GcsRoutingModule} from '@modules/gcs/gcs.routing.module';
import {SharedModule} from '@shared/shared.module';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbSelectModule,
} from "@nebular/theme";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";

@NgModule({
  declarations: [
    GcsComponent,
  ],
  imports: [
    CommonModule,
    GcsRoutingModule,
    SharedModule,
    NbIconModule,
    NbButtonModule,
    NbCardModule,
    NbSelectModule,
    MatTableModule,
    MatSortModule,
  ],
  providers: [],
})
export class GcsModule {
}
