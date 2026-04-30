import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, filter, firstValueFrom, map, Observable, of, startWith, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Product, ProductPayload } from '../../../core/models/product.model';
import { getApiErrorMessage, ProductApi } from '../../../core/services/product-api';
import {
  addOneYearIsoDate,
  releaseDateNotPastValidator,
  revisionDateMatchesReleaseValidator,
  todayIsoDate
} from './product-form.validators';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductForm implements OnInit {
  private readonly api = inject(ProductApi);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isEdit = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly minReleaseDate = todayIsoDate();
  protected readonly title = computed(() =>
    this.isEdit() ? 'Formulario de Edición' : 'Formulario de Registro'
  );

  protected readonly form = this.fb.nonNullable.group(
    {
      id: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        asyncValidators: [this.availableIdValidator()],
        updateOn: 'blur'
      }),
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, releaseDateNotPastValidator()]],
      date_revision: ['', [Validators.required]]
    },
    { validators: [revisionDateMatchesReleaseValidator()] }
  );

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    this.form.controls.date_release.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((releaseDate) => {
        this.form.controls.date_revision.setValue(addOneYearIsoDate(releaseDate), {
          emitEvent: false
        });
        this.form.updateValueAndValidity({ emitEvent: false });
      });

    if (productId) {
      this.loadProduct(productId);
    }
  }

  protected async submit(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    const status = await firstValueFrom(
      this.form.statusChanges.pipe(
        startWith(this.form.status),
        filter((formStatus) => formStatus !== 'PENDING'),
        take(1)
      )
    );

    if (status !== 'VALID') {
      return;
    }

    this.isSaving.set(true);
    const rawValue = this.form.getRawValue();

    const request$ = this.isEdit()
      ? this.api.updateProduct(rawValue.id, this.toPayload(rawValue))
      : this.api.createProduct(rawValue);

    request$.pipe(take(1)).subscribe({
      next: () => {
        this.successMessage.set(
          this.isEdit() ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.'
        );
        void this.router.navigateByUrl('/products');
      },
      error: (error: unknown) => {
        this.errorMessage.set(getApiErrorMessage(error));
        this.isSaving.set(false);
      }
    });
  }

  protected resetForm(): void {
    if (this.isEdit()) {
      return;
    }

    this.form.reset();
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  protected controlError(name: keyof Product): string {
    const control = this.form.controls[name];

    if (!control || (!control.touched && !control.dirty)) {
      return '';
    }

    if (control.hasError('required')) {
      return '¡Este campo es requerido!';
    }

    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Debe tener mínimo ${requiredLength} caracteres.`;
    }

    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength').requiredLength;
      return `Debe tener máximo ${requiredLength} caracteres.`;
    }

    if (control.hasError('releaseDatePast')) {
      return 'La fecha debe ser igual o mayor a la fecha actual.';
    }

    if (control.hasError('duplicatedId')) {
      return '¡ID no válido!';
    }

    if (name === 'date_revision' && this.form.hasError('revisionMismatch')) {
      return 'La fecha debe ser exactamente un año posterior a la liberación.';
    }

    return '';
  }

  protected hasError(name: keyof Product): boolean {
    return this.controlError(name).length > 0;
  }

  private loadProduct(productId: string): void {
    this.isEdit.set(true);
    this.isLoading.set(true);
    this.form.controls.id.disable({ emitEvent: false });

    this.api
      .getProduct(productId)
      .pipe(take(1))
      .subscribe({
        next: (product) => {
          this.form.patchValue(product);
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          this.errorMessage.set(getApiErrorMessage(error));
          this.isLoading.set(false);
        }
      });
  }

  private availableIdValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
      const value = control.value?.trim();

      if (!value || value.length < 3 || this.isEdit()) {
        return of(null);
      }

      return this.api.verifyIdentifier(value).pipe(
        map((exists) => (exists ? { duplicatedId: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  private toPayload(product: Product): ProductPayload {
    return {
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release,
      date_revision: product.date_revision
    };
  }
}
