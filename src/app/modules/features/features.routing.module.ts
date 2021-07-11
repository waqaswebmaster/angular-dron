import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FeaturesComponent} from '@modules/features/components/features/features.component';
import {FeatureCreateComponent} from "@modules/features/components/feature-create/feature-create.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FeaturesComponent,
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: FeatureCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule {
}
