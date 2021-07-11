import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '@shared/shared.module';
import {NbButtonModule, NbCardModule, NbInputModule, NbTagModule} from "@nebular/theme";
import {ManufacturersComponent} from '@modules/manufacturers/components/manufacturers/manufacturers.component';
import {ManufacturersRoutingModule} from '@modules/manufacturers/manufacturers.routing.module';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ManufacturersComponent,
  ],
  imports: [
    CommonModule,
    ManufacturersRoutingModule,
    SharedModule,
    NbTagModule,
    MatTableModule,
    MatSortModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    FormsModule,
  ],
  providers: [],
})
export class ManufacturersModule {
}
