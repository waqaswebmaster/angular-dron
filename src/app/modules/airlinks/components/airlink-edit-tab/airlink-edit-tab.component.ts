import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {validateAllFormFields} from "@shared/helpers/common";
import {AirLinkModel} from "@app/models";

@Component({
  selector: 'app-airlink-edit-tab',
  templateUrl: './airlink-edit-tab.component.html',
  styleUrls: ['./airlink-edit-tab.component.scss'],
})
export class AirLinkEditTabComponent implements OnInit, OnDestroy {
  @Input() airLink?: AirLinkModel;

  form: FormGroup;

  get f(): {[field: string]: AbstractControl} {
    return this.form.controls;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.airLink?.name, [Validators.required]),
      owner: new FormControl(this.airLink?.owner?.id, [Validators.required]),
      transfer_locked: new FormControl(true, [Validators.required]),
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
