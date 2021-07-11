import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IntegrationsComponent} from '@modules/integrations/components/integrations/integrations.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: IntegrationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationsRoutingModule {
}
