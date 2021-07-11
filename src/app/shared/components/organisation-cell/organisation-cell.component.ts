import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {OrganisationModel} from "@app/models";

@Component({
  selector: 'app-organisation-cell',
  templateUrl: './organisation-cell.component.html',
  styleUrls: ['./organisation-cell.component.scss'],
})
export class OrganisationCellComponent implements OnInit, OnDestroy {
  @Input() organisation: OrganisationModel;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
