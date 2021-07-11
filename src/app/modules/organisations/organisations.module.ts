import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '@shared/shared.module';
import {NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbTabsetModule, NbTagModule} from "@nebular/theme";
import {OrganisationsComponent} from '@modules/organisations/components/organisations/organisations.component';
import {OrganisationsRoutingModule} from '@modules/organisations/organisations.routing.module';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {OrganisationDetailComponent} from "@modules/organisations/components/organisation-detail/organisation-detail.component";
import {OrganisationProfileTabComponent} from "@modules/organisations/components/organisation-profile-tab/organisation-profile-tab.component";
import {OrganisationEditTabComponent} from "@modules/organisations/components/organisation-edit-tab/organisation-edit-tab.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {OrganisationMembersTabComponent} from "@modules/organisations/components/organisation-members-tab/organisation-members-tab.component";
import {OrganisationCreateComponent} from "@modules/organisations/components/organisation-create/organisation-create.component";
import {NgxDropzoneModule} from "ngx-dropzone";

@NgModule({
  declarations: [
    OrganisationsComponent,
    OrganisationDetailComponent,
    OrganisationProfileTabComponent,
    OrganisationEditTabComponent,
    OrganisationMembersTabComponent,
    OrganisationCreateComponent,
  ],
  imports: [
    CommonModule,
    OrganisationsRoutingModule,
    SharedModule,
    NbTagModule,
    MatTableModule,
    MatSortModule,
    NbButtonModule,
    NbTabsetModule,
    NbCardModule,
    NbInputModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    NbSelectModule,
    FormsModule,
    NgxDropzoneModule,
  ],
  providers: [],
})
export class OrganisationsModule {
}
