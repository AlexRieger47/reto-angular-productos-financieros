import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addOneYearIsoDate(value: string): string {
  if (!value) {
    return '';
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCFullYear(date.getUTCFullYear() + 1);

  return date.toISOString().slice(0, 10);
}

export function releaseDateNotPastValidator(now: () => string = todayIsoDate): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return control.value >= now() ? null : { releaseDatePast: true };
  };
}

export function revisionDateMatchesReleaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const release = control.get('date_release')?.value as string;
    const revision = control.get('date_revision')?.value as string;

    if (!release || !revision) {
      return null;
    }

    return revision === addOneYearIsoDate(release) ? null : { revisionMismatch: true };
  };
}
