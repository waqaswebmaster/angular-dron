import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OrganisationsComponent} from '@modules/organisations/components/organisations/organisations.component';
import {OrganisationDetailComponent} from "@modules/organisations/components/organisation-detail/organisation-detail.component";
import {OrganisationCreateComponent} from "@modules/organisations/components/organisation-create/organisation-create.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OrganisationsComponent,
  },
  {
    path: 'create',
    component: OrganisationCreateComponent,
  },
  {
    path: ':id',
    component: OrganisationDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationsRoutingModule {
}
