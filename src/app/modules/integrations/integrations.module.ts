import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '@shared/shared.module';
import {NbButtonModule, NbCardModule, NbInputModule, NbTagModule} from "@nebular/theme";
import {IntegrationsComponent} from '@modules/integrations/components/integrations/integrations.component';
import {IntegrationsRoutingModule} from '@modules/integrations/integrations.routing.module';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    IntegrationsComponent,
  ],
  imports: [
    CommonModule,
    IntegrationsRoutingModule,
    SharedModule,
    NbTagModule,
    MatTableModule,
    MatSortModule,
    NbButtonModule,
    NbCardModule,
    ReactiveFormsModule,
    NbInputModule,
  ],
  providers: [],
})
export class IntegrationsModule {
}
