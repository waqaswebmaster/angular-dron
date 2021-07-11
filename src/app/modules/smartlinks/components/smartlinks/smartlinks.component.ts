import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {SmartLinkModel} from "@app/models";
import {MatTableDataSource} from "@angular/material/table";
import {SmartLinkService} from "@services/smartlink.service";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-smartlinks',
  templateUrl: './smartlinks.component.html',
  styleUrls: ['./smartlinks.component.scss'],
})
export class SmartLinksComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'SmartLinks' }
  ];

  page = 0;
  totalCount = 0;
  search = '';
  sort = null;
  dataSource: MatTableDataSource<SmartLinkModel> = new MatTableDataSource();
  displayedColumns = ['name', 'owner', 'created', 'ip_address', 'software', 'last_seen', 'actions'];

  constructor(
    private router: Router,
    private smartLinkSrv: SmartLinkService,
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

    this.smartLinkSrv.search(filter).subscribe((res) => {
      this.totalCount = res.count;
      this.dataSource.data = res.results;
    }, (err) => {
      this.toastSrv.danger(err.message || 'Loading Smart Links failed');
    });
  }

  onSortChange(e): void {
    if (!e.direction)
      this.sort = null;
    else
      this.sort = `${e.direction === 'asc' ? '' : '-'}${e.active}`;

    this.loadTableData();
  }

  onDelete(item): void {
    if (!window.confirm('Are you sure to delete this row?'))
      return;

    // @TODO: delete row
    this.loadTableData();
  }
}
