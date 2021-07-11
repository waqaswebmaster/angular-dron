import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from "@app/models";

@Component({
  selector: 'app-user-activities-tab',
  templateUrl: './user-activities-tab.component.html',
  styleUrls: ['./user-activities-tab.component.scss'],
})
export class UserActivitiesTabComponent implements OnInit, OnDestroy {
  @Input() user: UserModel;

  activities = [
    { date: '2021-05-14 11:25:23', action: 'user_logged_in', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_in', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_out', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_in', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_in', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_out', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_in', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_in', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_in', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_out', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_in', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_in', ip: '89.36.71.203' },
    { date: '2021-05-14 11:25:23', action: 'user_logged_in', ip: '89.36.71.203' },
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
