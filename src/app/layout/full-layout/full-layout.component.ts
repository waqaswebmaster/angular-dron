import {Component, OnInit} from '@angular/core';
import {MENU_ITEMS} from "@constants";

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['full-layout.component.scss']
})
export class FullLayoutComponent implements OnInit {

  menu = MENU_ITEMS;

  constructor() {
  }

  ngOnInit(): void {
  }

}
