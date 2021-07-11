import {Component, Input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {OrganisationModel} from "@app/models";
import {IAccess} from "@app/types";
import {MetaDataService} from "@services/meta-data.service";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {emailValidator, validateAllFormFields} from "@shared/helpers/common";
import {NbDialogService} from "@nebular/theme";

@Component({
  selector: 'app-organisation-members-tab',
  templateUrl: './organisation-members-tab.component.html',
  styleUrls: ['./organisation-members-tab.component.scss'],
})
export class OrganisationMembersTabComponent implements OnInit, OnDestroy {
  @Input() organisation: OrganisationModel;

  levels: IAccess[] = [];
  addForm: FormGroup;

  get f(): {[field: string]: AbstractControl} {
    return this.addForm.controls;
  }

  constructor(
    private metaDataSrv: MetaDataService,
    private dialogSrv: NbDialogService,
  ) {
    this.levels = this.metaDataSrv.getAccessList();
  }

  ngOnInit(): void {
    this.addForm = new FormGroup({
      email: new FormControl('', [Validators.required, emailValidator]),
      level: new FormControl(0, [Validators.required]),
    });
  }

  ngOnDestroy(): void {
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.errors && (control.dirty || control.touched);
  }

  onOpenAddModal(dialog: TemplateRef<any>): void {
    this.dialogSrv.open(dialog);
  }

  onAddMember(dialogRef): void {
    if (this.addForm.invalid) {
      validateAllFormFields(this.addForm);
      return;
    }

    // TODO: add member

    this.addForm.reset();
    dialogRef.close();
  }
}
