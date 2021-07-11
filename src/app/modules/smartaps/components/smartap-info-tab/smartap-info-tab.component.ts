import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SmartAPModel} from "@app/models";
import {OPERATION_TYPES, RATINGS} from "@constants";

@Component({
  selector: 'app-smartap-info-tab',
  templateUrl: './smartap-info-tab.component.html',
  styleUrls: ['./smartap-info-tab.component.scss'],
})
export class SmartAPInfoTabComponent implements OnInit, OnDestroy {

  @Input() smartAP: SmartAPModel;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  getRatingText(rating: number): string {
    return RATINGS[rating] ?? '-';
  }

  getOperationTypeText(type: number): string {
    return OPERATION_TYPES[type] ?? '-';
  }
}
