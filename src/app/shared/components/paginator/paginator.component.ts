import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnDestroy, OnChanges {

  @Input() page = 0;
  @Input() length = 0;
  @Input() pageSize = 10;
  @Input() showFirstLastButton = false;
  @HostBinding() @Input() class: string;

  @Output() pageChange: EventEmitter<number> = new EventEmitter();

  pageCount = 1;
  buttons: number[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initPagination();
  }

  initPagination() {
    this.pageCount = Math.ceil(this.length / this.pageSize);
    if (this.page >= this.pageCount)
      this.page = Math.max(0, this.pageCount - 1);

    const buttons = [];

    if (this.page < 4) {
      for (let i = 0; i < this.page; i ++)
        buttons.push(i);
    } else {
      buttons.push(0);
      buttons.push(-1);
      buttons.push(this.page - 1);
    }

    buttons.push(this.page);

    if (this.page < this.pageCount - 4) {
      buttons.push(this.page + 1);
      buttons.push(-1);
      buttons.push(this.pageCount - 1);
    } else {
      for (let i = this.page + 1; i < this.pageCount; i ++)
        buttons.push(i);
    }

    this.buttons = buttons;
  }

  gotoPage(page: number): void {
    if (this.page !== page) {
      this.page = page;
      this.pageChange.emit(page);
    }
  }
}
