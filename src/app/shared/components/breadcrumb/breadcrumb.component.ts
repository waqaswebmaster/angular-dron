import {Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';

export interface IBreadcrumbItem {
  title: string;
  link?: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  @Input() breadcrumbs: IBreadcrumbItem[];
  @HostBinding() @Input() class: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
