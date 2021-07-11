import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SmartLinkModel} from "@app/models";

@Component({
  selector: 'app-smartlink-info-tab',
  templateUrl: './smartlink-info-tab.component.html',
  styleUrls: ['./smartlink-info-tab.component.scss'],
})
export class SmartLinkInfoTabComponent implements OnInit, OnDestroy {
  @Input() smartLink: SmartLinkModel;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
