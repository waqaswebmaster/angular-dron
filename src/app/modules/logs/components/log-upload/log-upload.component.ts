import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {validateAllFormFields} from "@shared/helpers/common";
import {Observable} from "rxjs";
import {FLIGHT_TYPES, OPERATION_TYPES, RATINGS, WIND_SPEEDS} from "@constants";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";

export interface IOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-log-upload',
  templateUrl: './log-upload.component.html',
  styleUrls: ['./log-upload.component.scss'],
})
export class LogUploadComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'Logs', link: '/logs' },
    { title: 'Upload Log' },
  ];

  file;
  form: FormGroup;

  flightTypes: IOption[] = [];
  operationTypes: IOption[] = [];
  ratings: IOption[] = [];
  windSpeeds: IOption[] = [];

  get f(): {[field: string]: AbstractControl} {
    return this.form.controls;
  }

  constructor() {
    this.flightTypes = Object.keys(FLIGHT_TYPES).map((id) => ({
      id: Number(id),
      name: FLIGHT_TYPES[id],
    }));
    this.operationTypes = Object.keys(OPERATION_TYPES).map((id) => ({
      id: Number(id),
      name: OPERATION_TYPES[id],
    }));
    this.ratings = Object.keys(RATINGS).map((id) => ({
      id: Number(id),
      name: RATINGS[id],
    }));
    this.windSpeeds = Object.keys(WIND_SPEEDS).map((id) => ({
      id: Number(id),
      name: WIND_SPEEDS[id],
    }));
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      flight_type: new FormControl(null, [Validators.required]),
      operation_type: new FormControl(null, [Validators.required]),
      rating: new FormControl(null, [Validators.required]),
      wind_speed: new FormControl(null, [Validators.required]),
      description: new FormControl(''),
      special_notes: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.errors && (control.dirty || control.touched);
  }

  onUploadFile(e): void {
    this.file = e.addedFiles[0];
  }

  uploadFile(id: number): Observable<string> {
    return new Observable((observer) => {
      if (!this.file) {
        observer.next();
        observer.complete();
      }

      // this.organisationSrv.uploadPhoto(id, this.file).subscribe((url) => {
      //   observer.next(url);
      //   observer.complete();
      // }, (err) => {
      //   this.toastSrv.danger(err.message ?? 'Operation failed', 'Upload photo');
      //   observer.error();
      //   observer.complete();
      // });
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      validateAllFormFields(this.form);
      return;
    }

    // TODO: save log here

    // this.organisationSrv.create(data).subscribe((result) => {
    //   this.uploadPhoto(result.id).subscribe(() => {
    //     this.toastSrv.success('Operation succeed', 'Create');
    //     this.router.navigate(['/organisations']).then();
    //   });
    // }, (err) => {
    //   this.toastSrv.danger(err.message ?? 'Operation failed', 'Create');
    // });
  }
}
