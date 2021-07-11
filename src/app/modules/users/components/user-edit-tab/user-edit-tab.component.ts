import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {validateAllFormFields} from "@shared/helpers/common";
import {UserModel} from "@app/models";
import {ICountry, ILanguage} from "@app/types";
import {MetaDataService} from "@services/meta-data.service";
import {UserService} from "@services/user.service";
import {NbToastrService} from "@nebular/theme";
import {PREFERRED_COUNTRIES} from "@constants";

@Component({
  selector: 'app-user-edit-tab',
  templateUrl: './user-edit-tab.component.html',
  styleUrls: ['./user-edit-tab.component.scss'],
})
export class UserEditTabComponent implements OnInit, OnDestroy {
  @Input() user: UserModel;

  form: FormGroup;
  countries: ICountry[] = [];
  languages: ILanguage[] = [];
  preferredCountries = PREFERRED_COUNTRIES;

  get f(): {[field: string]: AbstractControl} {
    return this.form.controls;
  }

  constructor(
    private userSrv: UserService,
    private metaDataSrv: MetaDataService,
    private toastSrv: NbToastrService,
  ) {
    this.countries = this.metaDataSrv.metaData.countries;
    this.languages = this.metaDataSrv.getLanguageList();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      first_name: new FormControl(this.user.first_name, [Validators.required]),
      last_name: new FormControl(this.user.last_name, [Validators.required]),
      phone: new FormControl(this.user.phone, [Validators.required]),
      country: new FormControl(this.user.country, [Validators.required]),
      language: new FormControl(this.user.language, [Validators.required]),
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

    const formData = this.form.value;
    if (typeof formData.phone === 'object')
      formData.phone = formData.phone.number;
    this.userSrv.update(this.user.id, formData).subscribe((user) => {
      Object.assign(this.user, user);
      this.user.level_name = this.metaDataSrv.getAccessName(this.user.level);
      this.user.country_name = this.metaDataSrv.getCountryName(this.user.country);
      this.user.language_name = this.metaDataSrv.getLanguageName(this.user.language);

      this.toastSrv.success('Operation succeed', 'Save');
    }, (err) => {
      this.toastSrv.danger(err.message ?? 'Operation failed', 'Save');
    });
  }
}
