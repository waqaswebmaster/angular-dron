import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-organisation-create',
  templateUrl: './organisation-create.component.html',
  styleUrls: ['./organisation-create.component.scss'],
})
export class OrganisationCreateComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [];

  constructor() {
    this.breadcrumbs = [
      { title: 'Organisations', link: '/organisations' },
      { title: 'Create organisation' },
    ];
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
