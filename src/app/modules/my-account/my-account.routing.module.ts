import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyAccountComponent} from "@modules/my-account/my-account.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MyAccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule {
}
