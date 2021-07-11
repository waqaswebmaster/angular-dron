import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {ActivatedRoute} from "@angular/router";
import {UserModel} from "@app/models";
import {UserService} from "@services/user.service";
import {NbToastrService} from "@nebular/theme";
import {MetaDataService} from "@services/meta-data.service";
import {getMediaUrl} from "@shared/helpers/common";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnDestroy {

  userId: number;
  user: UserModel;
  breadcrumbs: IBreadcrumbItem[];

  constructor(
    private route: ActivatedRoute,
    private userSrv: UserService,
    private toastSrv: NbToastrService,
    private metaDataSrv: MetaDataService,
  ) {
    this.userId = parseInt(this.route.snapshot.params.id);
    this.loadUser();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  loadUser(): void {
    this.userSrv.find(this.userId).subscribe((user) => {
      this.user = user;
      this.user.level_name = this.metaDataSrv.getAccessName(this.user.level);
      this.user.country_name = this.metaDataSrv.getCountryName(this.user.country);
      this.user.language_name = this.metaDataSrv.getLanguageName(this.user.language);
    }, (err) => {
      this.toastSrv.danger(err.message ?? 'Operation failed', 'Loading')
    });
  }

  onPhotoChange(photo: File): void {
    this.userSrv.uploadPhoto(this.user.id, photo).subscribe((uri) => {
      this.user.photo = uri;
      this.user.photo_url = getMediaUrl(uri);
      this.toastSrv.success('Operation succeed', 'Upload photo');
    }, (err) => {
      this.toastSrv.danger(err.message ?? 'Operation failed', 'Upload photo');
    });
  }

  onPhotoRemove(): void {
    this.userSrv.removePhoto(this.user.id).subscribe((url) => {
      this.user.photo = null;
      this.user.photo_url = null;
      this.toastSrv.success('Operation succeed', 'Remove photo');
    }, (err) => {
      this.toastSrv.danger(err.message ?? 'Operation failed', 'Remove photo');
    });
  }
}
