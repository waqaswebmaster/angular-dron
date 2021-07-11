import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SmartLinksComponent} from '@modules/smartlinks/components/smartlinks/smartlinks.component';
import {SmartLinkDetailComponent} from "@modules/smartlinks/components/smartlink-detail/smartlink-detail.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SmartLinksComponent,
  },
  {
    path: ':id',
    component: SmartLinkDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartLinksRoutingModule {
}
