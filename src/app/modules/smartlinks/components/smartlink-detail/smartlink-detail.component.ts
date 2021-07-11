import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {ActivatedRoute} from "@angular/router";
import {SmartLinkModel} from "@app/models";

@Component({
  selector: 'app-smartlink-detail',
  templateUrl: './smartlink-detail.component.html',
  styleUrls: ['./smartlink-detail.component.scss'],
})
export class SmartLinkDetailComponent implements OnInit, OnDestroy {

  smartLinkId: number;
  smartLink: SmartLinkModel = null;
  breadcrumbs: IBreadcrumbItem[];

  constructor(
    private route: ActivatedRoute,
  ) {
    this.smartLinkId = parseInt(this.route.snapshot.params.id);

    this.breadcrumbs = [
      {title: 'SmartLinks', link: '/smartlinks'},
      {title: ''},
    ];
  }

  ngOnInit(): void {
    this.loadSmartLink();
  }

  ngOnDestroy(): void {
  }

  loadSmartLink(): void {
    // @TODO: load smartlink info
    this.smartLink = new SmartLinkModel({
      "name": "Wingcopter",
      "uuid_link": "00000000c550b458",
      "created": "2020-02-25T15:43:26.812408Z",
      "ip_address": "10.1.1.16:4720",
      "is_online": false,
      "last_seen": "8 months, 2 weeks ago",
      "software": "0.1-10",
      port: 2342,
      "owner": {
        "full_name": "Kirill Shilov",
        "email": "kirill@sky-drones.com",
        "photo": "/assets/images/jack.png"
      } as any,
      users: [
        { id: 20, full_name: 'Krill Shilov', email: 'krill@sky-drones.com', level: 'Control' } as any,
        { id: 31, full_name: 'Boris Soldovskij', email: 'soldovskij@sky-drones.com', level: 'View' },
      ],
    });

    this.breadcrumbs[1].title = `${this.smartLink.name} (${this.smartLink.uuid_link})`;
  }
}
