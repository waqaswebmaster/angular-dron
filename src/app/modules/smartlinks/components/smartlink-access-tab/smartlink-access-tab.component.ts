import {Component, Input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {SmartLinkModel} from "@app/models";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {validateAllFormFields} from "@shared/helpers/common";
import {NbDialogService} from "@nebular/theme";

@Component({
  selector: 'app-smartlink-access-tab',
  templateUrl: './smartlink-access-tab.component.html',
  styleUrls: ['./smartlink-access-tab.component.scss'],
})
export class SmartlinkAccessTabComponent implements OnInit, OnDestroy {
  @Input() smartLink: SmartLinkModel;

  users = [];
  levels = ['View', 'Control'];
  addForm: FormGroup;

  get f(): {[field: string]: AbstractControl} {
    return this.addForm.controls;
  }

  constructor(
    private dialogSrv: NbDialogService,
  ) {
  }

  ngOnInit(): void {
    this.users = this.smartLink.users;

    this.addForm = new FormGroup({
      user: new FormControl(null, [Validators.required]),
      level: new FormControl(0, [Validators.required]),
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

  onOpenAddModal(dialog: TemplateRef<any>): void {
    this.dialogSrv.open(dialog);
  }

  onAddAccess(dialogRef): void {
    if (this.addForm.invalid) {
      validateAllFormFields(this.addForm);
      return;
    }

    // TODO: add access

    this.addForm.reset();
    dialogRef.close();
  }
}
