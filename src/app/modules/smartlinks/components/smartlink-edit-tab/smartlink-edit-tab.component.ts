import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {validateAllFormFields} from "@shared/helpers/common";
import {SmartLinkModel} from "@app/models";

@Component({
  selector: 'app-smartlink-edit-tab',
  templateUrl: './smartlink-edit-tab.component.html',
  styleUrls: ['./smartlink-edit-tab.component.scss'],
})
export class SmartLinkEditTabComponent implements OnInit, OnDestroy {
  @Input() smartLink?: SmartLinkModel;

  form: FormGroup;

  get f(): {[field: string]: AbstractControl} {
    return this.form.controls;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.smartLink?.name, [Validators.required]),
      owner: new FormControl(this.smartLink?.owner?.id, [Validators.required]),
    });
  }

  ngOnDestroy(): void {
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.errors && (control.dirty || control.touched);
  }

  onFieldChange(control: AbstractControl, value: any): void {
    control.setValue(value);
    control.markAsTouched();
  }

  onSave(): void {
    if (this.form.invalid) {
      validateAllFormFields(this.form);
      return;
    }

    // @TODO: save settings
    console.log(this.form.value);
  }
}
