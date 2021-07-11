import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SmartAPsComponent} from '@modules/smartaps/components/smartaps/smartaps.component';
import {SmartAPDetailComponent} from "@modules/smartaps/components/smartap-detail/smartap-detail.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SmartAPsComponent,
  },
  {
    path: ':id',
    component: SmartAPDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartAPsRoutingModule {
}
