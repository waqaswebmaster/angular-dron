import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {emailValidator, validateAllFormFields} from '@shared/helpers/common';
import {AuthService} from '@services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  formError = '';

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  constructor(
    private router: Router,
    private authSrv: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, emailValidator]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl(false),
    });
  }

  ngOnDestroy(): void {
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.errors && (control.dirty || control.touched);
  }

  login(frm): void {
    if (this.loginForm.invalid) {
      validateAllFormFields(this.loginForm);
      return;
    }

    this.authSrv.login(frm.email, frm.password, frm.remember).subscribe(() => {
      this.router.navigate(['/dashboard']).then();
    }, (err) => {
      this.loginForm.setErrors({error: true});
      this.formError = err.message || 'Email or password is invalid';
    });
  }
}
