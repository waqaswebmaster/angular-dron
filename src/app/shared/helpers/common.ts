import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from "@env";

export const validateAllFormFields = (formGroup: FormGroup) => {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({onlySelf: true});
    } else if (control instanceof FormGroup) {
      validateAllFormFields(control);
    }
  });
};

export const emailValidator = Validators.pattern(/^(([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+)?$/);

export const urlValidator = Validators.pattern(/^(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/);

export const cloneObject = (obj: any): any => {
  if (typeof obj !== 'object')
    return obj;

  if (Array.isArray(obj))
    return obj.map((item) => cloneObject(item));

  const copy = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key))
      copy[key] = cloneObject(obj[key]);
  }
  return copy;
};

export const getHumanizedDiff = (seconds: number): string => {
  if (seconds < 60)
    return 'a few seconds';

  let minuets = Math.floor(seconds / 60);
  if (minuets < 60)
    return `${minuets} minute${minuets > 1 ? 's' : ''}`;

  let hours = Math.floor(minuets / 60);
  minuets = minuets % 60;
  if (hours < 24)
    return `${hours} hour${hours > 1 ? 's' : ''}, ${minuets} minute${minuets > 1 ? 's' : ''}`;

  let days = Math.floor(hours / 24);
  hours = hours % 24;
  if (days < 30)
    return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;

  let months = Math.floor(days / 30);
  days = days % 30;
  if (months < 12)
    return `${months} month${months > 1 ? 's' : ''}, ${days} day${days > 1 ? 's' : ''}`;

  const years = Math.floor(months / 12);
  months = months % 12;
  return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
};

export const fromNow = (date: string, suffix = 'ago'): string => {
  const diff = (new Date().getTime() - new Date(date).getTime()) / 1000;
  let result = getHumanizedDiff(diff);
  if (suffix)
    result = `${result} ${suffix}`;
  return result;
};

export const formatDuration = (duration: number): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration / 60) % 60;
  const seconds = Math.round(duration % 60);
  return `${hours}:${Math.floor(minutes / 10)}${minutes % 10}:${Math.floor(seconds / 10)}${seconds % 10}`;
};

export const formatDistance = (distance: number): string => {
  const km = Math.floor(distance / 1000);
  const meter = Math.round(distance % 1000);
  return `${km ? `${km}km ` : ''}${meter}m`;
};

export const getMediaUrl = (uri: string): string => {
  if (!uri) {
    return null;
  }
  if (uri.startsWith('/'))
    uri = uri.substr(1);
  return `${environment.API_SERVER}/${uri}`;
}
