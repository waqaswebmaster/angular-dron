import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {ActivatedRoute} from "@angular/router";
import {LogModel} from "@app/models";
import {formatNumber} from "@angular/common";
import {CHART_COLOR, IChartInfo} from "@shared/components/chart-card/chart-card.component";
import {SeriesLineOptions} from "highcharts";

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.component.html',
  styleUrls: ['./log-detail.component.scss'],
})
export class LogDetailComponent implements OnInit, OnDestroy {

  logId: number;
  log: LogModel = null;
  breadcrumbs: IBreadcrumbItem[];

  charts: IChartInfo[] = [];
  nonDefaultParameters = [
    { id: 0, name: 'AUTO_ACC_MAX', value: 3, default: null, min: null, max: null, description: '(unknown)' },
    { id: 1, name: 'AUTO_CLIMB', value: 1, default: null, min: null, max: null, description: '(unknown)' },
    { id: 2, name: 'AUTO_H_SPD', value: 4, default: null, min: null, max: null, description: '(unknown)' },
    { id: 3, name: 'AUTO_V_SPD', value: 2, default: null, min: null, max: null, description: '(unknown)' },
    { id: 4, name: 'BAT_CAPACITY', value: 22000, default: null, min: null, max: null, description: '(unknown)' },
    { id: 5, name: 'BAT_CELLS_N', value: 6, default: null, min: null, max: null, description: '(unknown)' },
    { id: 6, name: 'BAT_C_OFFSET', value: 33.0968234234, default: null, min: null, max: null, description: '(unknown)' },
    { id: 7, name: 'BAT_C_SCALE', value: 0.052434234234, default: null, min: null, max: null, description: '(unknown)' },
    { id: 8, name: 'BAT_SENSOR', value: 4, default: null, min: null, max: null, description: '(unknown)' },
    { id: 9, name: 'BAT_TETHER_LOW', value: 23, default: null, min: null, max: null, description: '(unknown)' },
    { id: 10, name: 'BAT_TETHER_WRN', value: 23.5, default: null, min: null, max: null, description: '(unknown)' },
  ];
  loggedMessages = [
    { id: 0, time: '0:14:18', level: 'INFO', message: 'Armed' },
    { id: 1, time: '0:14:23', level: 'INFO', message: 'Flying' },
    { id: 2, time: '0:17:31', level: 'INFO', message: 'Landed' },
  ];

  constructor(
    private route: ActivatedRoute,
  ) {
    this.logId = parseInt(this.route.snapshot.params.id);

    this.breadcrumbs = [
      {title: 'Logs', link: '/logs'},
      {title: ''},
    ];
  }

  ngOnInit(): void {
    this.loadLog();
    // this.initChartData();
  }

  ngOnDestroy(): void {
  }

  loadLog(): void {
    // @TODO: load log info
    this.log = new LogModel({
      "uuid": "1bff379b-8bbb-4a72-bc51-41de91f9380f",
      "datetime_of_start": "2021-04-13T09:55:16.839318Z",
      "filename": "cfc4256bb03f5ce4c4c48918cf408b96.ulg",
      "parsing": 100,
      "hardware_version": "SmartAP v3.2",
      "software_version": "45cd45c",
      "rating": 1,
      "operation_type": 1,
      "duration": 498.505,
      "pilot": {
        "id": 2436,
        "full_name": "Riccardo Corbari",
        "email": "info@flyted.eu",
        "photo": null
      } as any,
      "drone": {
        "type": "smartap",
        "uuid_ap": "4777562809365495873",
        "name": "CWHX034"
      },
      users: [],
      uploaded_at: "2021-04-13T09:55:16.839318Z",
      updated_at: "2021-04-13T09:55:16.839318Z",
      description: 'CWhX033 - Hi-speed altitude loss testing. 17m/s max speed. Speedrun starting at +/-40m altitude. End of run left altitude naturally recover. EST_W_BAR = 0.35',
      special_notes: 'No special notes provided',
      hardware_name: 'SmartAP v3.2',
      os_version: 'ChibiOS',
      estimator: 'EKF',
      ground_altitude: 400.3,
      max_distance_from_home: 228.8,
      travelled_distance: 992,
      max_alt_diff: 42,
      average_speed: 5.3,
      max_speed: 16.55,
      max_speed_h: 16.55,
      max_speed_up: 2.91,
      max_speed_down: 3.15,
      battery_voltage_begin: 23.49,
      battery_voltage_end: 22.77,
      battery_average_current: 46,
      battery_max_current: 115.1,
    });

    this.breadcrumbs[1].title = this.log.filename;
  }

  formatDistance(value: number): string {
    if (typeof value !== 'number')
      return '-';
    return `${formatNumber(value, 'en', '0.0-0')} m`;
  }

  formatSpeed(value: number): string {
    if (typeof value !== 'number')
      return '-';
    return `${formatNumber(value, 'en', '0.2-2')} m/s <small>(${formatNumber(value * 3.6, 'en', '0.2-2')} km/h)</small>`;
  }

  initChartData(): void {
    const altitudeEstimate: IChartInfo = {
      title: 'Altitude Estimate',
      type: 'line-time',
      height: 500,
      yAxis: {
        title: {
          text: '<i class="text-secondary font-primary">[m]</i>',
          useHTML: true,
        },
        labels: {
          step: 5,
        },
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
        tickInterval: 10,
      },
      series: [
        { type: 'line', name:  'GPS altitude', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Barometer altitude', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
        { type: 'line', name:  'Fused altitude', color: CHART_COLOR.BLUE, data: [], showInLegend: true, },
        { type: 'line', name:  'Altitude setpoint', color: CHART_COLOR.WHITE, data: [], showInLegend: true, },
      ],
    };
    altitudeEstimate.series.forEach((chart: SeriesLineOptions, index) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random() * 80 + 260 + 50 * index,
        });
      }
    });
    this.charts.push(altitudeEstimate);

    const rollAngularRate: IChartInfo = {
      title: 'Role Angular Rate',
      type: 'line-time',
      yAxis: {
        title: {
          text: '<i class="text-secondary font-primary">[deg/s]</i>',
          useHTML: true,
        },
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'Role Rate Estimated', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Role Rate Setpoint', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
      ],
    };
    rollAngularRate.series.forEach((chart: SeriesLineOptions) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random() * 4.5 - 3.2,
        });
      }
    });
    this.charts.push(rollAngularRate);

    const pitchAngularRate: IChartInfo = {
      title: 'Pitch Angular Rate',
      type: 'line-time',
      yAxis: {
        title: {
          text: '<i class="text-secondary font-primary">[deg/s]</i>',
          useHTML: true,
        },
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'Pitch Rate Estimated', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Pitch Rate Setpoint', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
      ],
    };
    pitchAngularRate.series.forEach((chart: SeriesLineOptions) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random() * 3 - 1,
        });
      }
    });
    this.charts.push(pitchAngularRate);

    const yawAngularRate: IChartInfo = {
      title: 'Yaw Angular Rate',
      type: 'line-time',
      yAxis: {
        title: {
          text: '<i class="text-secondary font-primary">[deg/s]</i>',
          useHTML: true,
        },
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'Yaw Rate Estimated', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Yaw Rate Setpoint', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
      ],
    };
    yawAngularRate.series.forEach((chart: SeriesLineOptions) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random() * 1.5 - 1,
        });
      }
    });
    this.charts.push(yawAngularRate);

    const velocity: IChartInfo = {
      title: 'Velocity',
      type: 'line-time',
      yAxis: {
        title: {
          text: '<i class="text-secondary font-primary">[m/s]</i>',
          useHTML: true,
        },
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'Velocity X', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Velocity Y', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
        { type: 'line', name:  'Velocity Z', color: CHART_COLOR.BLUE, data: [], showInLegend: true, },
      ],
    };
    velocity.series.forEach((chart: SeriesLineOptions, index) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: (Math.random() * 10 - 5) * (3 - index),
        });
      }
    });
    this.charts.push(velocity);

    const manualControlInputs: IChartInfo = {
      title: 'Manual Control Inputs',
      type: 'line-time',
      yAxis: {
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'Roll', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Pitch', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
        { type: 'line', name:  'Yaw', color: CHART_COLOR.BLUE, data: [], showInLegend: true, },
        { type: 'line', name:  'Thrust', color: CHART_COLOR.BLACK, data: [], showInLegend: true, },
        { type: 'line', name:  'Mode', color: CHART_COLOR.WHITE, data: [], showInLegend: true, },
      ],
    };
    manualControlInputs.series.forEach((chart: SeriesLineOptions) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random() * 2 - 1,
        });
      }
    });
    this.charts.push(manualControlInputs);

    const actuatorControls: IChartInfo = {
      title: 'Actuator Controls',
      type: 'line-time',
      yAxis: {
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'Roll', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Pitch', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
        { type: 'line', name:  'Yaw', color: CHART_COLOR.BLUE, data: [], showInLegend: true, },
        { type: 'line', name:  'Thrust', color: CHART_COLOR.BLACK, data: [], showInLegend: true, },
      ],
    };
    actuatorControls.series.forEach((chart: SeriesLineOptions) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random() * 1.3 - 0.6,
        });
      }
    });
    this.charts.push(actuatorControls);


    const actuatorOutputs: IChartInfo = {
      title: 'Actuator Outputs',
      type: 'line-time',
      yAxis: {
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'Output 0', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Output 1', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
        { type: 'line', name:  'Output 2', color: CHART_COLOR.BLUE, data: [], showInLegend: true, },
        { type: 'line', name:  'Output 3', color: CHART_COLOR.BLACK, data: [], showInLegend: true, },
      ],
    };
    actuatorOutputs.series.forEach((chart: SeriesLineOptions) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random(),
        });
      }
    });
    this.charts.push(actuatorOutputs);

    const rawAcceleration: IChartInfo = {
      title: 'Raw Acceleration',
      type: 'line-time',
      yAxis: {
        title: {
          text: '<i class="text-secondary font-primary">[m/s^2]</i>',
          useHTML: true,
        },
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'X', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Y', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
        { type: 'line', name:  'Z', color: CHART_COLOR.BLUE, data: [], showInLegend: true, },
      ],
    };
    rawAcceleration.series.forEach((chart: SeriesLineOptions) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random() * 30 - 20,
        });
      }
    });
    this.charts.push(rawAcceleration);

    const rawAngularSpeed: IChartInfo = {
      title: 'Raw Angular Speed (Gyroscope)',
      type: 'line-time',
      yAxis: {
        title: {
          text: '<i class="text-secondary font-primary">[deg/s]</i>',
          useHTML: true,
        },
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'X', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Y', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
        { type: 'line', name:  'Z', color: CHART_COLOR.BLUE, data: [], showInLegend: true, },
      ],
    };
    rawAngularSpeed.series.forEach((chart: SeriesLineOptions) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random() * 2.5 - 1,
        });
      }
    });
    this.charts.push(rawAngularSpeed);

    const rawMagneticFields: IChartInfo = {
      title: 'Raw Magnetic Fields',
      type: 'line-time',
      yAxis: {
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'X', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Y', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
        { type: 'line', name:  'Z', color: CHART_COLOR.BLUE, data: [], showInLegend: true, },
      ],
    };
    rawMagneticFields.series.forEach((chart: SeriesLineOptions) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random() * 3.5 - 2.5,
        });
      }
    });
    this.charts.push(rawMagneticFields);

    const gpsUncertainty: IChartInfo = {
      title: 'GPS Uncertainty',
      type: 'line-time',
      yAxis: {
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'Horizontal position accuracy [m]', color: CHART_COLOR.RED, data: [], showInLegend: true, },
        { type: 'line', name:  'Vertical position accuracy [m]', color: CHART_COLOR.BLUE, data: [], showInLegend: true, },
        { type: 'line', name:  'Num satellites used', color: CHART_COLOR.WHITE, data: [], showInLegend: true, },
      ],
    };
    gpsUncertainty.series.forEach((chart: SeriesLineOptions, index) => {
      const values = [0.4, 0.6, 18];
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: values[index],
        });
      }
    });
    this.charts.push(gpsUncertainty);

    const powerSupply: IChartInfo = {
      title: 'Power Supply',
      type: 'line-time',
      yAxis: {
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'Voltage', color: CHART_COLOR.GREEN, data: [], showInLegend: true, },
        { type: 'line', name:  'Current', color: CHART_COLOR.BLUE, data: [], showInLegend: true, },
      ],
    };
    powerSupply.series.forEach((chart: SeriesLineOptions, index) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: index === 0 ? Math.random() * 3.5 + 21 : Math.random() * 120,
        });
      }
    });
    this.charts.push(powerSupply);

    const temperature: IChartInfo = {
      title: 'Temperature',
      type: 'line-time',
      yAxis: {
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'Temperature', color: CHART_COLOR.RED, data: [], showInLegend: true, },
      ],
    };
    temperature.series.forEach((chart: SeriesLineOptions) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random() * 0.7 + 41.7,
        });
      }
    });
    this.charts.push(temperature);

    const cpu: IChartInfo = {
      title: 'CPU',
      type: 'line-time',
      yAxis: {
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'outside',
        lineWidth: 1,
      },
      series: [
        { type: 'line', name:  'Load', color: CHART_COLOR.RED, data: [], showInLegend: true, },
      ],
    };
    cpu.series.forEach((chart: SeriesLineOptions) => {
      for (let i = 855; i < 1054; i ++) {
        chart.data.push({
          x: i * 1000,
          y: Math.random() * 0.025 + 0.1,
        });
      }
    });
    this.charts.push(cpu);
  }
}
