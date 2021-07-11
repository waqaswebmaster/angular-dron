import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GcsComponent} from '@modules/gcs/gcs.component';

const routes: Routes = [
  {
    path: '',
    component: GcsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GcsRoutingModule {
}
