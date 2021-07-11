import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from '@modules/users/components/users/users.component';
import {UserDetailComponent} from "@modules/users/components/user-detail/user-detail.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UsersComponent,
  },
  {
    path: ':id',
    component: UserDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
