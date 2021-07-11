import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AirLinkModel} from "@app/models";

@Component({
  selector: 'app-airlink-info-tab',
  templateUrl: './airlink-info-tab.component.html',
  styleUrls: ['./airlink-info-tab.component.scss'],
})
export class AirLinkInfoTabComponent implements OnInit, OnDestroy {
  @Input() airLink: AirLinkModel;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
