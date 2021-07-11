import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from "@app/models";

@Component({
  selector: 'app-user-features-tab',
  templateUrl: './user-features-tab.component.html',
  styleUrls: ['./user-features-tab.component.scss'],
})
export class UserFeaturesTabComponent implements OnInit, OnDestroy {
  @Input() user: UserModel;

  features = [
    { name: 'Flight recordings access', description: 'Description goes here', free_trial: '7 days', monthly_fee: 10, yearly_fee: 100, started: '', expiration: '' },
    { name: 'Flight recordings access', description: 'Description goes here', free_trial: '', monthly_fee: 10, yearly_fee: 100, started: '', expiration: '' },
    { name: 'Flight recordings access', free_trial: '', monthly_fee: 10, yearly_fee: 100, started: '', expiration: '' },
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
