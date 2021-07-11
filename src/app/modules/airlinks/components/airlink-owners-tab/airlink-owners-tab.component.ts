import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AirLinkModel} from "@app/models";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-airlink-owners-tab',
  templateUrl: './airlink-owners-tab.component.html',
  styleUrls: ['./airlink-owners-tab.component.scss'],
})
export class AirlinkOwnersTabComponent implements OnInit, OnDestroy {
  @Input() airLink: AirLinkModel;

  page = 0;
  totalCount = 0;
  search = '';
  sort = null;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns = ['user', 'created_at'];

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

    this.totalCount = 51;
    this.dataSource.data = [
      { user: { full_name: 'Grigory Lazurin', photo: '/assets/images/jack.png' }, created_at: '2020-02-25T15:43:26.812408Z' },
      { user: { full_name: 'Grigory Lazurin' }, created_at: '2020-02-25T15:43:26.812408Z' },
      { user: { full_name: 'Grigory Lazurin' }, created_at: '2020-02-25T15:43:26.812408Z' },
      { user: { full_name: 'Grigory Lazurin', photo: '/assets/images/jack.png' }, created_at: '2020-02-25T15:43:26.812408Z' },
      { user: { full_name: 'Grigory Lazurin', photo: '/assets/images/jack.png' }, created_at: '2020-02-25T15:43:26.812408Z' },
      { user: { full_name: 'Grigory Lazurin', photo: '/assets/images/jack.png' }, created_at: '2020-02-25T15:43:26.812408Z' },
      { user: { full_name: 'Grigory Lazurin', photo: '/assets/images/jack.png' }, created_at: '2020-02-25T15:43:26.812408Z' },
      { user: { full_name: 'Grigory Lazurin' }, created_at: '2020-02-25T15:43:26.812408Z' },
      { user: { full_name: 'Grigory Lazurin', photo: '/assets/images/jack.png' }, created_at: '2020-02-25T15:43:26.812408Z' },
      { user: { full_name: 'Grigory Lazurin', photo: '/assets/images/jack.png' }, created_at: '2020-02-25T15:43:26.812408Z' },
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
