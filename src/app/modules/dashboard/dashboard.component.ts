import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {UserModel} from "@app/models";
import * as moment from "moment";
import {CHART_COLOR, IChartInfo} from "@shared/components/chart-card/chart-card.component";
import {SeriesPieOptions} from "highcharts";
import {formatNumber} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  durations = [
    { title: 'All time', value: 'all' },
    { title: 'Today', value: '1d' },
    { title: 'Last 7 days', value: '7d' },
    { title: 'Last 30 days', value: '30d' },
    { title: 'Last 90 days', value: '90d' },
    { title: 'Last 365 days', value: '365d' },
    { title: 'Custom', value: 'custom' },
  ]

  statistics = [
    { title: 'Users', value: 2858, link: '/users' },
    { title: 'Autopilots', value: 96, link: '/smartaps' },
    { title: 'SmartLinks', value: 59, link: '/smartlinks' },
    { title: 'Flights', value: 747, link: '/logs' },
    { title: 'Flight Hours', value: 64.66, link: '/logs' },
    { title: 'Flight Distance', value: '1073km', link: '/logs' },
  ];

  latestFlights = [
    { date: '2021-04-30 15:41:24', drone: '', pilot: 'Amar Larkshya', duration: '0:00:01' },
    { date: '2021-04-30 15:41:24', drone: '', pilot: 'Amar Larkshya', duration: '0:00:07' },
    { date: '2021-04-30 15:41:24', drone: '', pilot: 'Clog Works', duration: '0:05:46' },
    { date: '2021-04-30 15:41:24', drone: 'CWHX034 (4777562809365495873) [SmartAP]', pilot: 'Amar Larkshya', duration: '0:00:01' },
    { date: '2021-04-30 15:41:24', drone: '', pilot: 'Amar Larkshya', duration: '0:00:07' },
    { date: '2021-04-30 15:41:24', drone: '', pilot: 'Clog Works', duration: '0:05:46' },
    { date: '2021-04-30 15:41:24', drone: '', pilot: 'Amar Larkshya', duration: '0:00:01' },
    { date: '2021-04-30 15:41:24', drone: '', pilot: 'Amar Larkshya', duration: '0:00:07' },
    { date: '2021-04-30 15:41:24', drone: '', pilot: 'Clog Works', duration: '0:05:46' },
    { date: '2021-04-30 15:41:24', drone: '', pilot: 'Amar Larkshya', duration: '0:00:07' },
  ];

  flights = [];
  totalFlights = 0;
  flightDurations = [];
  totalFlightDuration = 0;

  duration = 'all';
  charts: {
    title: string;
    icon?: string;
    class?: string;
    chart: IChartInfo;
  }[] = [];

  get user(): UserModel {
    return this.authService.user;
  }

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.initTotalFlights();
    this.initCharts();
  }

  ngOnDestroy(): void {
  }

  initTotalFlights(): void {
    let dateFrom = moment().subtract(2, 'months');
    const dateTo = moment();
    while (dateFrom.isBefore(dateTo)) {
      const date = dateFrom.toDate().getTime();
      const flightCount = Math.floor(Math.random() * 35);
      const flightDuration = Math.floor(Math.random() * 600) / 100;
      this.flights.push({
        x: date,
        y: flightCount,
      });
      this.flightDurations.push({
        x: date,
        y: flightDuration,
      });
      this.totalFlights += flightCount;
      this.totalFlightDuration += flightDuration;

      dateFrom = dateFrom.add(1, 'day');
    }
  }

  initCharts(): void {
    const flightType: IChartInfo = {
      title: 'Flight Type',
      type: 'pie',
      series: [
        {
          type: 'pie',
          name: 'Flight Type',
          data: [
            { name: 'Commercial', y: 5, color: CHART_COLOR.BLUE },
            { name: 'Training', y: 22, color: CHART_COLOR.RED },
            { name: 'Test', y: 254, color: CHART_COLOR.GREEN },
            { name: 'No value', y: 16, color: CHART_COLOR.WHITE },
          ],
          showInLegend: true,
          dataLabels: true,
        } as SeriesPieOptions,
      ],
    };
    this.charts.push({
      title: 'Flight Type',
      icon: 'fa fa-plane',
      class: 'col-sm-6 col-md-4',
      chart: flightType,
    });

    const operationType: IChartInfo = {
      title: 'Operation Type',
      type: 'pie',
      series: [
        {
          type: 'pie',
          name: 'Operation Type',
          data: [
            { name: 'Visual', y: 75, color: CHART_COLOR.BLUE },
            { name: 'EVLOS', y: 8, color: CHART_COLOR.RED },
            { name: 'BVLOS', y: 2, color: CHART_COLOR.GREEN },
            { name: 'No value', y: 15, color: CHART_COLOR.WHITE },
          ],
          showInLegend: true,
          dataLabels: true,
        } as SeriesPieOptions,
      ],
    };
    this.charts.push({
      title: 'Operation Type',
      icon: 'fa fa-list-alt',
      class: 'col-sm-6 col-md-4',
      chart: operationType,
    });

    const flightRating: IChartInfo = {
      title: 'Flight Rating',
      type: 'pie',
      series: [
        {
          type: 'pie',
          name: 'Flight Rating',
          data: [
            { name: 'Excellent', y: 621, color: CHART_COLOR.BLUE },
            { name: 'Good', y: 29, color: CHART_COLOR.RED },
            { name: 'Satisfied', y: 78, color: CHART_COLOR.GREEN },
            { name: 'Bad', y: 26, color: CHART_COLOR.ORANGE },
            { name: 'Crash (system error)', y: 11, color: CHART_COLOR.SKY },
            { name: 'Crash (pilot error)', y: 7, color: CHART_COLOR.PURPLE },
            { name: 'No value', y: 241, color: CHART_COLOR.WHITE },
          ],
          showInLegend: true,
          dataLabels: true,
        } as SeriesPieOptions,
      ],
    };
    this.charts.push({
      title: 'Flight Rating',
      icon: 'fa fa-star',
      class: 'col-md-4',
      chart: flightRating,
    });

    const totalFlights: IChartInfo = {
      title: 'Total flights',
      type: 'line-date',
      series: [
        {
          type: 'line',
          name: 'Total flights',
          color: CHART_COLOR.BLUE,
          data: this.flights,
          showInLegend: false,
        },
      ],
    };
    this.charts.push({
      title: `Total flights: <b>${this.totalFlights}</b>`,
      icon: 'fa fa-plane-departure',
      class: 'col-md-6',
      chart: totalFlights,
    });

    const totalFlightDuration: IChartInfo = {
      title: 'Total flight duration',
      type: 'line-date',
      series: [
        {
          type: 'line',
          name: 'Total flight duration',
          color: CHART_COLOR.BLUE,
          data: this.flightDurations,
          showInLegend: false,
        },
      ],
    };
    this.charts.push({
      title: `Total flight duration: <b>${formatNumber(this.totalFlightDuration, 'en', '0.2-2')}</b>`,
      icon: 'fa fa-plane-departure',
      class: 'col-md-6',
      chart: totalFlightDuration,
    });

    const flightsByPilot: IChartInfo = {
      title: 'Flights by Pilot',
      type: 'column',
      xAxis: {
        categories: ['Krill Shilov', 'Kamil Zaripov', 'Peter Opdam', 'Yuri Alistratov', 'Boris Soldovskij', 'Jerry Bystry', 'Arma Lakshya', 'Clifton Hipsher', 'eli vigdorchik', 'Joseph Wang'],
      },
      series: [
        {
          type: 'column',
          name: 'Flights',
          color: CHART_COLOR.BLUE,
          borderWidth: 0,
          data: [321, 157, 124, 120, 5, 4, 4, 3, 2, 1],
          showInLegend: false,
        },
      ],
    };
    this.charts.push({
      title: 'Flights by Pilot',
      icon: 'fa fa-user',
      class: 'col-md-6',
      chart: flightsByPilot,
    });

    const flightHoursByPilot: IChartInfo = {
      title: 'Flight hours by Pilot',
      type: 'column',
      xAxis: {
        categories: ['Kamil Zaripov', 'Peter Opdam', 'Krill Shilov', 'Clifton Hipsher', 'Jerry Bystry', 'Arma Lakshya', 'Yuri Alistratov', 'Joseph Wang', 'Boris Soldovskij', 'eli vigdorchik'],
      },
      series: [
        {
          type: 'column',
          name: 'Flight hours',
          color: CHART_COLOR.BLUE,
          borderWidth: 0,
          data: [25, 18, 12, 5, 5, 2, 1, 1, 1, 1],
          showInLegend: false,
        },
      ],
    };
    this.charts.push({
      title: 'Flight hours by Pilot',
      icon: 'fa fa-user',
      class: 'col-md-6',
      chart: flightHoursByPilot,
    });

    const flightsByDrone: IChartInfo = {
      title: 'Flights by Drone',
      type: 'column',
      xAxis: {
        categories: ['F450', 'SP-CWDMHX017', 'ASO-3-SD', 'DarkMatter#2', 'Clog#1', 'CWHX033', 'DarkMatter#1', 'Ikar-1300', 'F450-PX4', 'ASO-2-VS'],
      },
      series: [
        {
          type: 'column',
          name: 'Flights',
          color: CHART_COLOR.BLUE,
          borderWidth: 0,
          data: [294, 103, 97, 51, 44, 44, 37, 35, 35, 9],
          showInLegend: false,
        },
      ],
    };
    this.charts.push({
      title: 'Flights by Drone',
      icon: 'fa fa-plane',
      class: 'col-md-6',
      chart: flightsByDrone,
    });

    const flightHoursByDrone: IChartInfo = {
      title: 'Flight hours by Drone',
      type: 'column',
      xAxis: {
        categories: ['SP-CWDMHX017', 'ASO-3-SD', 'DarkMatter#2', 'Clog#1', 'CWHX033', 'F450', 'Ikar-1300', 'DarkMatter#1', 'ASO-2-VS', 'F450-PX4'],
      },
      series: [
        {
          type: 'column',
          name: 'Flight hours',
          color: CHART_COLOR.BLUE,
          borderWidth: 0,
          data: [19, 8, 7, 7, 4, 4, 2, 2, 2],
          showInLegend: false,
        },
      ],
    };
    this.charts.push({
      title: 'Flight hours by Drone',
      icon: 'fa fa-plane',
      class: 'col-md-6',
      chart: flightHoursByDrone,
    });
  }
}
