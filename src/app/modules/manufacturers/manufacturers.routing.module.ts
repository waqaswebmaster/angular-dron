import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManufacturersComponent} from '@modules/manufacturers/components/manufacturers/manufacturers.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ManufacturersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManufacturersRoutingModule {
}
