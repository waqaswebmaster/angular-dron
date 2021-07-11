import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {UserModel} from "@app/models";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "@services/user.service";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'Users' }
  ];

  page = 0;
  totalCount = 0;
  search = '';
  sort = null;
  dataSource: MatTableDataSource<UserModel> = new MatTableDataSource();
  displayedColumns = ['full_name', 'email', 'date_joined', 'last_login'];

  constructor(
    private router: Router,
    private userSrv: UserService,
    private toastSrv: NbToastrService,
  ) {
  }

  ngOnInit(): void {
    this.loadTableData();
  }

  ngOnDestroy(): void {
  }

  loadTableData(): void {
    const filter: any = {
      offset: this.page * 10,
      limit: 10,
    };
    if (this.sort)
      filter.order_by = this.sort;
    if (this.search)
      filter.search = this.search;

    this.userSrv.search(filter).subscribe((res) => {
      this.totalCount = res.count;
      this.dataSource.data = res.results;
    }, (err) => {
      this.toastSrv.danger(err.message || 'Loading users failed');
    });
  }

  onSortChange(e): void {
    if (!e.direction)
      this.sort = null;
    else
      this.sort = `${e.direction === 'asc' ? '' : '-'}${e.active}`;

    this.loadTableData();
  }
}
