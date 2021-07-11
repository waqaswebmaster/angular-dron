import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {UserModel} from "@app/models";
import {AuthService} from "@services/auth.service";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit, OnDestroy {

  account: UserModel;
  breadcrumbs: IBreadcrumbItem[];

  constructor(
    private authSrv: AuthService,
  ) {
    this.account = this.authSrv.user;

    this.breadcrumbs = [
      { title: this.account.full_name },
    ];
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
