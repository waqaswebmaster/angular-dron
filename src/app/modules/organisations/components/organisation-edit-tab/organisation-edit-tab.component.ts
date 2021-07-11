import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {emailValidator, urlValidator, validateAllFormFields} from "@shared/helpers/common";
import {OrganisationModel} from "@app/models";
import {MetaDataService} from "@services/meta-data.service";
import {IActivity, ICountry, ISize, IState} from "@app/types";
import {OrganisationService} from "@services/organisation.service";
import {NbToastrService} from "@nebular/theme";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {PREFERRED_COUNTRIES} from "@constants";

@Component({
  selector: 'app-organisation-edit-tab',
  templateUrl: './organisation-edit-tab.component.html',
  styleUrls: ['./organisation-edit-tab.component.scss'],
})
export class OrganisationEditTabComponent implements OnInit, OnDestroy {
  @Input() organisation?: OrganisationModel;

  form: FormGroup;

  sizes: ISize[] = [];
  activities: IActivity[] = [];
  countries: ICountry[] = [];
  states: IState[] = [];
  preferredCountries = PREFERRED_COUNTRIES;

  photo;

  get f(): {[field: string]: AbstractControl} {
    return this.form.controls;
  }

  constructor(
    private metaDataSrv: MetaDataService,
    private organisationSrv: OrganisationService,
    private toastSrv: NbToastrService,
    private router: Router,
  ) {
    this.sizes = this.metaDataSrv.getSizeList();
    this.activities = this.metaDataSrv.metaData.activities;
    this.countries = this.metaDataSrv.metaData.countries;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.organisation?.name, [Validators.required]),
      email: new FormControl(this.organisation?.email, [Validators.required, emailValidator]),
      phone: new FormControl(this.organisation?.phone, [Validators.required]),
      website: new FormControl(this.organisation?.website, [Validators.required, urlValidator]),
      size: new FormControl(this.organisation?.size, [Validators.required]),
      activity: new FormControl(this.organisation?.activity, [Validators.required]),
      address: new FormControl(this.organisation?.address, [Validators.required]),
      country: new FormControl(this.organisation?.country, [Validators.required]),
      state: new FormControl(this.organisation?.state, [Validators.required]),
      zip: new FormControl(this.organisation?.zip, [Validators.required]),
    });

    this.loadStates(this.organisation?.country);
  }

  ngOnDestroy(): void {
  }

  loadStates(countryId): void {
    this.states = [];
    if (!countryId)
      return;

    this.metaDataSrv.getStatesFromCountryId(countryId).subscribe((states) => {
      this.states = states;
    });
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.errors && (control.dirty || control.touched);
  }

  onCountryChange(id): void {
    this.form.patchValue({
      state: null,
    });
    this.loadStates(id);
  }

  onUploadPhoto(e): void {
    this.photo = e.addedFiles[0];
  }

  onSave(): void {
    if (this.form.invalid) {
      validateAllFormFields(this.form);
      return;
    }

    const data = this.form.value;
    if (typeof data.phone === 'object')
      data.phone = data.phone.number;

    if (this.organisation) {
      this.onUpdate(data);
    } else {
      this.onCreate(data);
    }
  }

  uploadPhoto(id: number): Observable<string> {
    return new Observable((observer) => {
      if (!this.photo) {
        observer.next();
        observer.complete();
      }

      this.organisationSrv.uploadPhoto(id, this.photo).subscribe((url) => {
        observer.next(url);
        observer.complete();
      }, (err) => {
        this.toastSrv.danger(err.message ?? 'Operation failed', 'Upload photo');
        observer.error();
        observer.complete();
      });
    });
  }

  onCreate(data): void {
    this.organisationSrv.create(data).subscribe((result) => {
      this.uploadPhoto(result.id).subscribe(() => {
        this.toastSrv.success('Operation succeed', 'Create');
        this.router.navigate(['/organisations']).then();
      });
    }, (err) => {
      this.toastSrv.danger(err.message ?? 'Operation failed', 'Create');
    });
  }

  onUpdate(data): void {
    data.photo = this.organisation.photo;
    data.photo_cropped = this.organisation.photo_cropped;

    this.organisationSrv.update(this.organisation.id, data).subscribe((response) => {
      Object.assign(this.organisation, response);

      this.organisation.activity_name = this.metaDataSrv.getActivityName(this.organisation.activity);
      this.organisation.country_name = this.metaDataSrv.getCountryName(this.organisation.country);
      this.organisation.state_name = this.states.find((state) => state.id === this.organisation.state)?.name;
      this.organisation.size_text = this.metaDataSrv.getSizeText(this.organisation.size);

      this.toastSrv.success('Operation succeed', 'Save');
    }, (err) => {
      this.toastSrv.danger(err.message ?? 'Operation failed', 'Save');
    });
  }
}
