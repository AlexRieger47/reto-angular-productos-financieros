import { FormControl, FormGroup } from '@angular/forms';

import {
  addOneYearIsoDate,
  releaseDateNotPastValidator,
  revisionDateMatchesReleaseValidator
} from './product-form.validators';

describe('product form validators', () => {
  it('adds one year to an ISO date', () => {
    expect(addOneYearIsoDate('2026-05-10')).toBe('2027-05-10');
  });

  it('rejects release dates before today', () => {
    const validator = releaseDateNotPastValidator(() => '2026-04-28');

    expect(validator(new FormControl('2026-04-27'))).toEqual({ releaseDatePast: true });
    expect(validator(new FormControl('2026-04-28'))).toBeNull();
  });

  it('requires revision date to be exactly one year after release date', () => {
    const validator = revisionDateMatchesReleaseValidator();
    const form = new FormGroup({
      date_release: new FormControl('2026-05-01'),
      date_revision: new FormControl('2027-05-02')
    });

    expect(validator(form)).toEqual({ revisionMismatch: true });

    form.controls.date_revision.setValue('2027-05-01');
    expect(validator(form)).toBeNull();
  });
});
