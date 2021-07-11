import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SmartLinkModel} from "@app/models";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-smartlink-sessions-tab',
  templateUrl: './smartlink-sessions-tab.component.html',
  styleUrls: ['./smartlink-sessions-tab.component.scss'],
})
export class SmartlinkSessionsTabComponent implements OnInit, OnDestroy {
  @Input() smartLink: SmartLinkModel;

  page = 0;
  totalCount = 0;
  search = '';
  sort = null;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns = ['id', 'record_count', 'record_start_at', 'record_stop_at', 'created'];

  constructor() {
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

    this.totalCount = 432;
    this.dataSource.data = [
      { id: 3062, record_count: 1, record_start_at: '2020-02-25T15:43:26.812408Z', record_stop_at: '2020-02-25T15:43:26.812408Z', created: '2020-02-25T15:43:26.812408Z' },
      { id: 3061, record_count: 1, record_start_at: '2020-02-25T15:43:26.812408Z', record_stop_at: '2020-02-25T15:43:26.812408Z', created: '2020-02-25T15:43:26.812408Z' },
      { id: 3060, record_count: 1, record_start_at: '2020-02-25T15:43:26.812408Z', record_stop_at: '2020-02-25T15:43:26.812408Z', created: '2020-02-25T15:43:26.812408Z' },
      { id: 3059, record_count: 1, record_start_at: '2020-02-25T15:43:26.812408Z', record_stop_at: '2020-02-25T15:43:26.812408Z', created: '2020-02-25T15:43:26.812408Z' },
      { id: 3058, record_count: 1, record_start_at: '2020-02-25T15:43:26.812408Z', record_stop_at: '2020-02-25T15:43:26.812408Z', created: '2020-02-25T15:43:26.812408Z' },
      { id: 3057, record_count: 1, record_start_at: '2020-02-25T15:43:26.812408Z', record_stop_at: '2020-02-25T15:43:26.812408Z', created: '2020-02-25T15:43:26.812408Z' },
      { id: 3056, record_count: 1, record_start_at: '2020-02-25T15:43:26.812408Z', record_stop_at: '2020-02-25T15:43:26.812408Z', created: '2020-02-25T15:43:26.812408Z' },
      { id: 3055, record_count: 1, record_start_at: '2020-02-25T15:43:26.812408Z', record_stop_at: '2020-02-25T15:43:26.812408Z', created: '2020-02-25T15:43:26.812408Z' },
      { id: 3054, record_count: 1, record_start_at: '2020-02-25T15:43:26.812408Z', record_stop_at: '2020-02-25T15:43:26.812408Z', created: '2020-02-25T15:43:26.812408Z' },
      { id: 3053, record_count: 1, record_start_at: '2020-02-25T15:43:26.812408Z', record_stop_at: '2020-02-25T15:43:26.812408Z', created: '2020-02-25T15:43:26.812408Z' },
    ];
  }

  onSortChange(e): void {
    if (!e.direction)
      this.sort = null;
    else
      this.sort = `${e.direction === 'asc' ? '' : '-'}${e.active}`;

    this.loadTableData();
  }
}
