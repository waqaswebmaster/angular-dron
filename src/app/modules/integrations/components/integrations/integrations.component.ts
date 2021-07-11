import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Router} from "@angular/router";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {NbDialogService, NbToastrService} from "@nebular/theme";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {emailValidator, urlValidator, validateAllFormFields} from "@shared/helpers/common";

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss'],
})
export class IntegrationsComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'Integrations' }
  ];

  connectForm: FormGroup;

  get f(): {[field: string]: AbstractControl} {
    return this.connectForm.controls;
  }

  constructor(
    private router: Router,
    private toastSrv: NbToastrService,
    private dialogSrv: NbDialogService,
  ) {
  }

  ngOnInit(): void {
    this.connectForm = new FormGroup({
      email: new FormControl('', [Validators.required, emailValidator]),
      password: new FormControl('', [Validators.required]),
      url: new FormControl('', [urlValidator]),
    });
  }

  ngOnDestroy(): void {
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.errors && (control.dirty || control.touched);
  }

  onOpenConnectModal(dialog: TemplateRef<any>): void {
    this.dialogSrv.open(dialog);
  }

  onConnect(dialogRef): void {
    if (this.connectForm.invalid) {
      validateAllFormFields(this.connectForm);
      return;
    }

    // TODO: connect

    this.connectForm.reset();
    dialogRef.close();
  }
}
