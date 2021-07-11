import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '@shared/shared.module';
import {NbButtonModule, NbCardModule, NbInputModule, NbTagModule} from "@nebular/theme";
import {FeaturesComponent} from '@modules/features/components/features/features.component';
import {FeaturesRoutingModule} from '@modules/features/features.routing.module';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {FeatureCreateComponent} from "@modules/features/components/feature-create/feature-create.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    FeaturesComponent,
    FeatureCreateComponent,
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
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
export class FeaturesModule {
}
