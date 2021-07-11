import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {OrganisationModel} from "@app/models";

@Component({
  selector: 'app-organisation-profile-tab',
  templateUrl: './organisation-profile-tab.component.html',
  styleUrls: ['./organisation-profile-tab.component.scss'],
})
export class OrganisationProfileTabComponent implements OnInit, OnDestroy {
  @Input() organisation: OrganisationModel;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
