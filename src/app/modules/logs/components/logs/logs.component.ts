import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {LogModel} from "@app/models";
import {MatTableDataSource} from "@angular/material/table";
import {LogService} from "@services/log.service";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'Logs' }
  ];

  page = 0;
  totalCount = 0;
  sort = null;
  dataSource: MatTableDataSource<LogModel> = new MatTableDataSource();
  displayedColumns = ['datetime_of_start', 'duration', 'drone', 'pilot', 'hardware_version', 'software_version', 'rating', 'operation_type'];

  constructor(
    private router: Router,
    private logSrv: LogService,
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

    this.logSrv.search(filter).subscribe((res) => {
      this.totalCount = res.count;
      this.dataSource.data = res.results;
    }, (err) => {
      this.toastSrv.danger(err.message || 'Loading Logs failed');
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
