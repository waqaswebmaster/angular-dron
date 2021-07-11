import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {validateAllFormFields} from "@shared/helpers/common";
import {SmartAPModel, UserModel} from "@app/models";
import {NbAutocompleteComponent, NbToastrService} from "@nebular/theme";
import {SmartAPService} from "@services/smartap.service";

@Component({
  selector: 'app-smartap-edit-tab',
  templateUrl: './smartap-edit-tab.component.html',
  styleUrls: ['./smartap-edit-tab.component.scss'],
})
export class SmartAPEditTabComponent implements OnInit, OnDestroy {
  @Input() smartAP: SmartAPModel;

  @ViewChild('userAutocomplete') userAutocomplete: NbAutocompleteComponent<UserModel>;

  form: FormGroup;

  vehicleTypes = ['Unknown', 'Copter', 'Plane', 'VTOL'];
  statuses = ['Active', 'Maintenance', 'Retired'];

  get f(): {[field: string]: AbstractControl} {
    return this.form.controls;
  }

  constructor(
    private smartAPSrv: SmartAPService,
    private toastSrv: NbToastrService,
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.smartAP.name, [Validators.required]),
      vehicle_type_name: new FormControl(this.smartAP.vehicle_type_name, [Validators.required]),
      status_name: new FormControl(this.smartAP.status_name, [Validators.required]),
      owner: new FormControl(this.smartAP.owner?.id, [Validators.required]),
      users: new FormControl(this.smartAP.users.map((user) => user.id), [Validators.required]),
    });

    if (!this.smartAP.can_change_owner) {
      this.f.owner.setValidators(null);
    }
    if (!this.smartAP.can_change_users) {
      this.f.users.setValidators(null);
    }
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

    this.smartAPSrv.update(this.smartAP.uuid_ap, this.form.value).subscribe((response) => {
      Object.assign(this.smartAP, response);
      this.toastSrv.success('Operation succeed', 'Save');
    }, (err) => {
      this.toastSrv.danger(err.message ?? 'Operation failed', 'Save');
    });
  }
}
