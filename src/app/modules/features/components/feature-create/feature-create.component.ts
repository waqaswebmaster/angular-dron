import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {validateAllFormFields} from "@shared/helpers/common";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-feature-create',
  templateUrl: './feature-create.component.html',
  styleUrls: ['./feature-create.component.scss'],
})
export class FeatureCreateComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'Features', link: '/features' },
    { title: 'Create Feature' },
  ];

  form: FormGroup;

  get f(): {[field: string]: AbstractControl} {
    return this.form.controls;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      service_name: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      trial_period: new FormControl(0, [Validators.required, Validators.min(0)]),
      monthly_fee: new FormControl(null, [Validators.required, Validators.min(0)]),
      yearly_fee: new FormControl(null, [Validators.required, Validators.min(0)]),
    });
  }

  ngOnDestroy(): void {
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.errors && (control.dirty || control.touched);
  }

  onSave(): void {
    if (this.form.invalid) {
      validateAllFormFields(this.form);
      return;
    }

    // TODO: save log here
    console.log(this.form.value);
  }
}
