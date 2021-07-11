import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-avatar-editor',
  templateUrl: './avatar-editor.component.html',
  styleUrls: ['./avatar-editor.component.scss'],
})
export class AvatarEditorComponent implements OnInit, OnDestroy {
  @Input() avatar?: string;
  @Output() changed: EventEmitter<File> = new EventEmitter();
  @Output() removed: EventEmitter<void> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onUpload($event): void {
    const file = $event.addedFiles[0];
    // this.avatar = URL.createObjectURL(file);
    this.changed.emit(file);
  }

  onRemove(): void {
    // this.avatar = null;

    this.removed.emit();
  }
}
