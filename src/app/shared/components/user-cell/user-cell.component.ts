import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from "@app/models";

@Component({
  selector: 'app-user-cell',
  templateUrl: './user-cell.component.html',
  styleUrls: ['./user-cell.component.scss'],
})
export class UserCellComponent implements OnInit, OnDestroy {
  @Input() user: UserModel;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
