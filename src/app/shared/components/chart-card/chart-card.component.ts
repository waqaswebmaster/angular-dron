import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Chart} from "angular-highcharts";
import {
  SeriesOptionsType,
  XAxisOptions,
  YAxisOptions,
} from "highcharts";
import * as moment from "moment";
import {formatDuration} from "@shared/helpers/common";

export interface IChartInfo {
  title: string;
  type: TChartType;
  height?: number;
  xAxis?: XAxisOptions | XAxisOptions[];
  yAxis?: YAxisOptions | YAxisOptions[];
  series: SeriesOptionsType[];
}

export type TChartType = 'pie' | 'column' | 'line-date' | 'line-time';

export enum CHART_COLOR {
  BLUE = '#3374d9',
  RED = '#f84036',
  GREEN = '#2ecc40',
  ORANGE = '#f8851b',
  SKY = '#7fdbff',
  PURPLE = '#b109c9',
  WHITE = '#e5e5e5',
  BLACK = '#000000',
}

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
})
export class ChartCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() title: string;
  @Input() icon?: string;
  @Input('chart') chartInfo: IChartInfo;

  chart: Chart;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initChart();
  }

  initChart(): void {
    if (this.chartInfo.type === 'pie') {
      this.initPieChart();
    } else if (this.chartInfo.type === 'column') {
      this.initColumnChart();
    } else if (this.chartInfo.type === 'line-date') {
      this.initLineDateChart();
    } else if (this.chartInfo.type === 'line-time') {
      this.initLineTimeChart();
    }
  }

  initPieChart(): void {
    this.chart = new Chart({
      chart: {
        type: 'pie',
        height: this.chartInfo.height ?? 300,
      },
      title: null,
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          shadow: false,
          center: ['50%', '50%'],
          innerSize: '60%',
          borderColor: null,
        },
      },
      series: this.chartInfo.series,
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '10px',
          fontWeight: 'normal',
          color: '#464d51',
        },
        itemMarginTop: 5,
        symbolPadding: 5,
      },
    });
  }

  initColumnChart(): void {
    this.chart = new Chart({
      chart: {
        type: 'column',
        height: this.chartInfo.height ?? 300,
      },
      xAxis: this.chartInfo.xAxis,
      yAxis: {
        title: null,
        labels: {
          style: {
            fontFamily: 'Open Sans, sans-serif',
          }
        },
        ...this.chartInfo.yAxis,
      },
      title: null,
      credits: {
        enabled: false
      },
      series: this.chartInfo.series,
    });
  }

  initLineDateChart(): void {
    this.chart = new Chart({
      chart: {
        type: 'line',
        zoomType: 'x',
        height: this.chartInfo.height ?? 300,
      },
      title: null,
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'Open Sans, sans-serif',
          },
          formatter(data) {
            return moment(data.value).format('LL');
          },
        },
        tickLength: 0,
        ...this.chartInfo.xAxis,
      },
      yAxis: {
        title: null,
        labels: {
          style: {
            fontFamily: 'Open Sans, sans-serif',
          }
        },
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
        ...this.chartInfo.yAxis,
      },
      series: this.chartInfo.series,
      tooltip: {
        xDateFormat: '%B %e, %Y',
      }
    });
  }

  initLineTimeChart(): void {
    this.chart = new Chart({
      chart: {
        type: 'line',
        zoomType: 'x',
        height: this.chartInfo.height ?? 300,
      },
      title: null,
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'Open Sans, sans-serif',
          },
          formatter(data) {
            return formatDuration(data.value as number / 1000);
          },
        },
        tickWidth: 1,
        tickLength: 5,
        ...this.chartInfo.xAxis,
      },
      yAxis: {
        labels: {
          style: {
            fontFamily: 'Open Sans, sans-serif',
          },
        },
        ...this.chartInfo.yAxis,
      },
      series: this.chartInfo.series,
      tooltip: {
        xDateFormat: '%k:%M:%S',
      }
    });
  }
}
