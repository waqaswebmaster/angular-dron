import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnDestroy {

  @Input() value = '';
  @HostBinding() @Input() class: string;

  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onKeyPress(e): void {
    if (e.key === 'Enter') {
      this.valueChange.emit(this.value);
    }
  }
}
