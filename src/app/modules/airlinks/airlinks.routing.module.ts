import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AirLinksComponent} from '@modules/airlinks/components/airlinks/airlinks.component';
import {AirLinkDetailComponent} from "@modules/airlinks/components/airlink-detail/airlink-detail.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AirLinksComponent,
  },
  {
    path: ':id',
    component: AirLinkDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirLinksRoutingModule {
}
