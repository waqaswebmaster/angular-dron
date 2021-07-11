import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {SmartAPModel} from "@app/models";
import {MatTableDataSource} from "@angular/material/table";
import {SmartAPService} from "@services/smartap.service";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-smartaps',
  templateUrl: './smartaps.component.html',
  styleUrls: ['./smartaps.component.scss'],
})
export class SmartAPsComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'SmartAPs' }
  ];

  page = 0;
  totalCount = 0;
  search = '';
  sort = null;
  dataSource: MatTableDataSource<SmartAPModel> = new MatTableDataSource();
  displayedColumns = ['name', 'owner', 'created', 'platform', 'hardware', 'software', 'flight', 'last_seen'];

  constructor(
    private router: Router,
    private smartAPSrv: SmartAPService,
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

    this.smartAPSrv.search(filter).subscribe((res) => {
      this.totalCount = res.count;
      this.dataSource.data = res.results;
    }, (err) => {
      this.toastSrv.danger(err.message || 'Loading Smart APs failed');
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
