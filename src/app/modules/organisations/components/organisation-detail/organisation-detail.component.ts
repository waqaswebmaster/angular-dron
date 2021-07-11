import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {ActivatedRoute} from "@angular/router";
import {OrganisationModel} from "@app/models";
import {OrganisationService} from "@services/organisation.service";
import {NbToastrService} from "@nebular/theme";
import {MetaDataService} from "@services/meta-data.service";
import {getMediaUrl} from "@shared/helpers/common";

@Component({
  selector: 'app-organisation-detail',
  templateUrl: './organisation-detail.component.html',
  styleUrls: ['./organisation-detail.component.scss'],
})
export class OrganisationDetailComponent implements OnInit, OnDestroy {

  organisationId: number;
  organisation: OrganisationModel;
  breadcrumbs: IBreadcrumbItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private organisationSrv: OrganisationService,
    private metaDataSrv: MetaDataService,
    private toastSrv: NbToastrService,
  ) {
    this.organisationId = parseInt(this.route.snapshot.params.id);

    this.breadcrumbs = [
      { title: 'Organisations', link: '/organisations' },
      { title: '' },
    ];
  }

  ngOnInit(): void {
    this.loadOrganization();
  }

  ngOnDestroy(): void {
  }

  loadOrganization(): void {
    this.organisationSrv.find(this.organisationId).subscribe((organisation) => {
      organisation.size_text = this.metaDataSrv.getSizeText(organisation.size);

      this.organisation = organisation;
      this.breadcrumbs[1].title = this.organisation.name;
    }, (err) => {
      this.toastSrv.danger(err.message ?? 'Operation failed', 'Loading');
    });
  }

  onLogoChange(photo: File): void {
    this.organisationSrv.uploadPhoto(this.organisation.id, photo).subscribe((uri) => {
      this.organisation.photo = uri;
      this.organisation.photo_cropped = uri;
      this.organisation.logo = getMediaUrl(uri);
      this.toastSrv.success('Operation succeed', 'Upload photo');
    }, (err) => {
      this.toastSrv.danger(err.message ?? 'Operation failed', 'Upload photo');
    });
  }

  onLogoRemove(): void {
    this.organisationSrv.removePhoto(this.organisation.id).subscribe((url) => {
      this.organisation.photo = null;
      this.organisation.photo_cropped = null;
      this.organisation.logo = null;
      this.toastSrv.success('Operation succeed', 'Remove photo');
    }, (err) => {
      this.toastSrv.danger(err.message ?? 'Operation failed', 'Remove photo');
    });
  }
}
