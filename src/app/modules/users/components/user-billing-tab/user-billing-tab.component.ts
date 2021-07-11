import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {validateAllFormFields} from "@shared/helpers/common";
import {UserModel} from "@app/models";

@Component({
  selector: 'app-user-billing-tab',
  templateUrl: './user-billing-tab.component.html',
  styleUrls: ['./user-billing-tab.component.scss'],
})
export class UserBillingTabComponent implements OnInit, OnDestroy {
  @Input() user: UserModel;

  form: FormGroup;

  cards: FormGroup[] = [];
  defaultCard: FormGroup = null;
  maxCardId = 0;

  get f(): {[field: string]: AbstractControl} {
    return this.form.controls;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.form = new FormGroup({});
    this.onAddCard();
  }

  ngOnDestroy(): void {
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.errors && (control.dirty || control.touched);
  }

  onAddCard(card: any = {}): void {
    const cardForm = new FormGroup({
      number: new FormControl(card.number, [Validators.required]),
      expiration: new FormControl(card.expiration, [Validators.required, Validators.pattern(/^((0[1-9])|(1[0-2]))\d{2}$/)]),
      cvc: new FormControl(card.cvc, [Validators.required]),
      holder: new FormControl(card.holder, [Validators.required]),
    });
    const id = this.maxCardId + 1;
    this.maxCardId ++;

    this.cards.push(cardForm);
    this.form.addControl(id.toString(), cardForm);

    if (!this.defaultCard)
      this.defaultCard = cardForm;
  }

  onRemoveCard(card: FormGroup): void {
    this.cards = this.cards.filter((item) => item !== card);

    const id = Object.keys(this.f).find((key) => this.f[key] === card);
    this.form.removeControl(id);

    if (this.defaultCard === card) {
      this.defaultCard = this.cards[0];
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      validateAllFormFields(this.form);
      return;
    }

    // @TODO: save cards
  }
}
