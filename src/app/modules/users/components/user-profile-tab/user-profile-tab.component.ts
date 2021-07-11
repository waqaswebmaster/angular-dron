import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from "@app/models";

@Component({
  selector: 'app-user-profile-tab',
  templateUrl: './user-profile-tab.component.html',
  styleUrls: ['./user-profile-tab.component.scss'],
})
export class UserProfileTabComponent implements OnInit, OnDestroy {
  @Input() user: UserModel;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
