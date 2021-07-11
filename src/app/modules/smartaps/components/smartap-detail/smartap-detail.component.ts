import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {ActivatedRoute} from "@angular/router";
import {SmartAPModel} from "@app/models";
import {SmartAPService} from "@services/smartap.service";

@Component({
  selector: 'app-smartap-detail',
  templateUrl: './smartap-detail.component.html',
  styleUrls: ['./smartap-detail.component.scss'],
})
export class SmartAPDetailComponent implements OnInit, OnDestroy {

  smartAPId: string;
  smartAP: SmartAPModel;
  breadcrumbs: IBreadcrumbItem[];

  constructor(
    private route: ActivatedRoute,
    private smartAPSrv: SmartAPService,
  ) {
    this.smartAPId = this.route.snapshot.params.id;

    this.loadSmartAP();

    this.breadcrumbs = [
      { title: 'SmartAPs', link: '/smartaps' },
      { title: '' },
    ];
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  loadSmartAP(): void {
    this.smartAPSrv.find(this.smartAPId).subscribe((smartAP) => {
      this.smartAP = smartAP;

      this.breadcrumbs[1].title = `${this.smartAP.name} (${this.smartAP.uuid_ap})`;
    });
  }
}
