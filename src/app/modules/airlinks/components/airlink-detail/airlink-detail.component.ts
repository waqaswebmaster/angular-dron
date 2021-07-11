import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {ActivatedRoute} from "@angular/router";
import {AirLinkModel} from "@app/models";

@Component({
  selector: 'app-airlink-detail',
  templateUrl: './airlink-detail.component.html',
  styleUrls: ['./airlink-detail.component.scss'],
})
export class AirLinkDetailComponent implements OnInit, OnDestroy {

  airLinkId: number;
  airLink: AirLinkModel = null;
  breadcrumbs: IBreadcrumbItem[];

  constructor(
    private route: ActivatedRoute,
  ) {
    this.airLinkId = parseInt(this.route.snapshot.params.id);

    this.breadcrumbs = [
      {title: 'AirLinks', link: '/airlinks'},
      {title: ''},
    ];
  }

  ngOnInit(): void {
    this.loadAirLink();
  }

  ngOnDestroy(): void {
  }

  loadAirLink(): void {
    // @TODO: load airlink info
    this.airLink = new AirLinkModel({
      "name": "Mylink",
      "uuid_link": "146a91f105ee1891",
      uuid_ap: '920342873982742384738938234atest1',
      "created": "2021-05-11T21:31:54.167432Z",
      "ip_address": "0.0.0.0",
      "is_online": false,
      "last_seen": "1 week, 2 days ago",
      port: 4323,
      software: null,
      "ap_architecture": "Unknown",
      "ap_hardware": "Unknown",
      "ap_software_version": "0.0.0",
      "ap_software_git_hash": "Unknown",
      "link_architecture": "Unknown",
      "link_hardware": "Unknown",
      "link_software_version": "0.0.0",
      "link_software_git_hash": "Unknown",
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

    this.breadcrumbs[1].title = `${this.airLink.name} (${this.airLink.uuid_link} - ${this.airLink.uuid_ap})`;
  }
}
