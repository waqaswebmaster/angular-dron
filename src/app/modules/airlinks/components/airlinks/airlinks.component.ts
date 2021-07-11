import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {AirLinkModel} from "@app/models";
import {MatTableDataSource} from "@angular/material/table";
import {AirLinkService} from "@services/airlink.service";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-airlinks',
  templateUrl: './airlinks.component.html',
  styleUrls: ['./airlinks.component.scss'],
})
export class AirLinksComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'AirLinks' }
  ];

  page = 0;
  totalCount = 0;
  search = '';
  sort = null;
  dataSource: MatTableDataSource<AirLinkModel> = new MatTableDataSource();
  displayedColumns = ['name', 'owner', 'created', 'ip_address', 'last_seen',
    'ap_architecture', 'ap_hardware', 'ap_software_version', 'ap_software_git_hash',
    'link_architecture', 'link_hardware', 'link_software_version', 'link_software_git_hash', 'actions'];

  constructor(
    private router: Router,
    private airLinkSrv: AirLinkService,
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

    this.airLinkSrv.search(filter).subscribe((res) => {
      this.totalCount = res.count;
      this.dataSource.data = res.results;
    }, (err) => {
      this.toastSrv.danger(err.message || 'Loading Air Links failed');
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
