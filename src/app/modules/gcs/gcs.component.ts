import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {UserModel} from "@app/models";
import * as moment from "moment";
import {MatTableDataSource} from "@angular/material/table";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {CHART_COLOR, IChartInfo} from "@shared/components/chart-card/chart-card.component";
import {SeriesPieOptions} from "highcharts";

@Component({
  selector: 'app-gcs',
  templateUrl: './gcs.component.html',
  styleUrls: ['./gcs.component.scss'],
})
export class GcsComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'GCS Sessions' }
  ];

  durations = [
    { title: 'All time', value: 'all' },
    { title: 'Today', value: '1d' },
    { title: 'Last 7 days', value: '7d' },
    { title: 'Last 30 days', value: '30d' },
    { title: 'Last 90 days', value: '90d' },
    { title: 'Last 365 days', value: '365d' },
    { title: 'Custom', value: 'custom' },
  ]

  sessionActivities = [];

  charts: {
    title: string;
    icon?: string;
    class?: string;
    chart: IChartInfo;
  }[] = [];

  duration = 'all';
  page = 0;
  totalCount = 0;
  search = '';
  sort = null;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns = ['id', 'user', 'platform', 'ip_address', 'country', 'city', 'started', 'duration'];

  get user(): UserModel {
    return this.authService.user;
  }

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.initSessionActivities();
    this.initCharts();
    this.loadTableData();
  }

  ngOnDestroy(): void {
  }

  initSessionActivities(): void {
    let dateFrom = moment().subtract(6, 'months');
    const dateTo = moment();
    while (dateFrom.isBefore(dateTo)) {
      const date = dateFrom.toDate().getTime();
      const count = Math.floor(Math.random() * 25000);
      this.sessionActivities.push({
        x: date,
        y: count,
      });
      dateFrom = dateFrom.add(1, 'day');
    }
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

    this.totalCount = 3425;
    this.dataSource.data = [
      { id: 673329, user: { full_name: 'Amar Lakashya' }, platform: 'Linux', ip_address: '77.103.30.29', country: 'United Kingdom', city: 'Birmingham', started: '2021-05-25 17:24:15', duration: '0:00:24' },
      { id: 673328, user: { full_name: 'Kamil Zaripov', photo: 'assets/images/jack.png' }, platform: 'Linux', ip_address: '77.103.30.29', country: 'United Kingdom', city: 'Birmingham', started: '2021-05-25 17:24:15', duration: '0:00:24' },
      { id: 673327, user: { full_name: 'Amar Lakashya' }, platform: 'Linux', ip_address: '77.103.30.29', country: 'United Kingdom', city: 'Birmingham', started: '2021-05-25 17:24:15', duration: '0:00:24' },
      { id: 673326, user: { full_name: 'Amar Lakashya' }, platform: 'Linux', ip_address: '77.103.30.29', country: 'United Kingdom', city: 'Birmingham', started: '2021-05-25 17:24:15', duration: '0:00:24' },
      { id: 673325, user: { full_name: 'Amar Lakashya' }, platform: 'Linux', ip_address: '77.103.30.29', country: 'United Kingdom', city: 'Birmingham', started: '2021-05-25 17:24:15', duration: '0:00:24' },
      { id: 673324, user: { full_name: 'Amar Lakashya' }, platform: 'Linux', ip_address: '77.103.30.29', country: 'United Kingdom', city: 'Birmingham', started: '2021-05-25 17:24:15', duration: '0:00:24' },
      { id: 673323, user: { full_name: 'Amar Lakashya' }, platform: 'Linux', ip_address: '77.103.30.29', country: 'United Kingdom', city: 'Birmingham', started: '2021-05-25 17:24:15', duration: '0:00:24' },
      { id: 673322, user: { full_name: 'Amar Lakashya' }, platform: 'Linux', ip_address: '77.103.30.29', country: 'United Kingdom', city: 'Birmingham', started: '2021-05-25 17:24:15', duration: '0:00:24' },
      { id: 673321, user: { full_name: 'Amar Lakashya' }, platform: 'Linux', ip_address: '77.103.30.29', country: 'United Kingdom', city: 'Birmingham', started: '2021-05-25 17:24:15', duration: '0:00:24' },
      { id: 673320, user: { full_name: 'Amar Lakashya' }, platform: 'Linux', ip_address: '77.103.30.29', country: 'United Kingdom', city: 'Birmingham', started: '2021-05-25 17:24:15', duration: '0:00:24' },
    ];
  }

  onSortChange(e): void {
    if (!e.direction)
      this.sort = null;
    else
      this.sort = `${e.direction === 'asc' ? '' : '-'}${e.active}`;

    this.loadTableData();
  }

  initCharts(): void {
    const operatingSystems: IChartInfo = {
      title: 'Operating System',
      type: 'pie',
      series: [
        {
          type: 'pie',
          name: 'Operating System',
          data: [
            { name: 'Unknown', y: 0, color: CHART_COLOR.BLUE },
            { name: 'Windows', y: 995, color: CHART_COLOR.RED },
            { name: 'MacOS', y: 10, color: CHART_COLOR.GREEN },
            { name: 'Linux', y: 0, color: CHART_COLOR.ORANGE },
            { name: 'Android', y: 12, color: CHART_COLOR.SKY },
            { name: 'iOS', y: 0, color: CHART_COLOR.PURPLE },
            { name: 'Other', y: 0, color: CHART_COLOR.WHITE },
          ],
          showInLegend: true,
          dataLabels: true,
        } as SeriesPieOptions,
      ],
    };
    this.charts.push({
      title: 'Operating System',
      icon: 'fa fa-desktop',
      class: 'col-sm-6 col-md-4',
      chart: operatingSystems,
    });

    const countries: IChartInfo = {
      title: 'Country',
      type: 'pie',
      series: [
        {
          type: 'pie',
          name: 'Country',
          data: [
            { name: 'United States', y: 481, color: CHART_COLOR.BLUE },
            { name: 'United Kingdom', y: 329, color: CHART_COLOR.RED },
            { name: 'South Korea', y: 91, color: CHART_COLOR.GREEN },
            { name: 'Italy', y: 95, color: CHART_COLOR.ORANGE },
            { name: 'Russia', y: 10, color: CHART_COLOR.SKY },
            { name: 'Other', y: 8, color: CHART_COLOR.PURPLE },
          ],
          showInLegend: true,
          dataLabels: true,
        } as SeriesPieOptions,
      ],
    };
    this.charts.push({
      title: 'Country',
      icon: 'fa fa-globe',
      class: 'col-sm-6 col-md-4',
      chart: countries,
    });

    const users: IChartInfo = {
      title: 'Users',
      type: 'pie',
      series: [
        {
          type: 'pie',
          name: 'Count',
          data: [
            { name: 'journathan gueffroy', y: 362, color: CHART_COLOR.BLUE },
            { name: 'michael page', y: 138, color: CHART_COLOR.RED },
            { name: 'Philtronics Production', y: 135, color: CHART_COLOR.GREEN },
            { name: 'kael kaczynski', y: 129, color: CHART_COLOR.ORANGE },
            { name: 'Clog Works', y: 108, color: CHART_COLOR.SKY },
            { name: 'Other', y: 128, color: CHART_COLOR.PURPLE },
          ],
          showInLegend: true,
          dataLabels: true,
        } as SeriesPieOptions,
      ],
    };
    this.charts.push({
      title: 'Users',
      icon: 'fa fa-users',
      class: 'col-sm-6 col-md-4',
      chart: users,
    });

    const sessionActivities: IChartInfo = {
      title: 'GCS sessions activity',
      type: 'line-date',
      series: [
        {
          type: 'line',
          name: 'GCS sessions activity',
          color: CHART_COLOR.BLUE,
          data: this.sessionActivities,
          showInLegend: false,
        },
      ],
    };
    this.charts.push({
      title: 'GCS sessions activity',
      icon: 'fa fa-plane-departure',
      class: 'col-12',
      chart: sessionActivities,
    });
  }
}
