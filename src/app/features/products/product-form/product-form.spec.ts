import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Product } from '../../../core/models/product.model';
import { ProductApi } from '../../../core/services/product-api';
import { ProductForm } from './product-form';

const product: Product = {
  id: 'trj-crd',
  name: 'Tarjeta Credito',
  description: 'Tarjeta de consumo',
  logo: 'assets-1.png',
  date_release: '2026-05-01',
  date_revision: '2027-05-01'
};

function routeWithId(id: string | null) {
  return {
    snapshot: {
      paramMap: {
        get: () => id
      }
    }
  };
}

describe('ProductForm', () => {
  it('shows required field errors before submitting an empty form', async () => {
    await render(ProductForm, {
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: routeWithId(null) },
        {
          provide: ProductApi,
          useValue: {
            verifyIdentifier: jest.fn().mockReturnValue(of(false))
          }
        }
      ]
    });

    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(await screen.findAllByText('¡Este campo es requerido!')).toHaveLength(6);
  });

  it('auto-fills revision date one year after release date', async () => {
    await render(ProductForm, {
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: routeWithId(null) },
        {
          provide: ProductApi,
          useValue: {
            verifyIdentifier: jest.fn().mockReturnValue(of(false))
          }
        }
      ]
    });

    fireEvent.input(screen.getByLabelText('Fecha Liberación'), {
      target: { value: '2026-05-01' }
    });

    expect(screen.getByLabelText('Fecha Revisión')).toHaveValue('2027-05-01');
  });

  it('creates a product with valid data', async () => {
    const createProduct = jest.fn().mockReturnValue(of({ message: 'ok', data: product }));

    const { fixture } = await render(ProductForm, {
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: routeWithId(null) },
        {
          provide: ProductApi,
          useValue: {
            verifyIdentifier: jest.fn().mockReturnValue(of(false)),
            createProduct
          }
        }
      ]
    });

    jest.spyOn(fixture.debugElement.injector.get(Router), 'navigateByUrl').mockResolvedValue(true);

    fireEvent.input(screen.getByLabelText('ID'), { target: { value: product.id } });
    fireEvent.blur(screen.getByLabelText('ID'));
    fireEvent.input(screen.getByLabelText('Nombre'), { target: { value: product.name } });
    fireEvent.input(screen.getByLabelText('Descripción'), {
      target: { value: product.description }
    });
    fireEvent.input(screen.getByLabelText('Logo'), { target: { value: product.logo } });
    fireEvent.input(screen.getByLabelText('Fecha Liberación'), {
      target: { value: product.date_release }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith(product);
    });
  });

  it('loads a product for edition and updates without changing the id', async () => {
    const updateProduct = jest.fn().mockReturnValue(of({ message: 'ok', data: product }));

    const { fixture } = await render(ProductForm, {
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: routeWithId(product.id) },
        {
          provide: ProductApi,
          useValue: {
            getProduct: jest.fn().mockReturnValue(of(product)),
            verifyIdentifier: jest.fn().mockReturnValue(of(true)),
            updateProduct
          }
        }
      ]
    });

    jest.spyOn(fixture.debugElement.injector.get(Router), 'navigateByUrl').mockResolvedValue(true);

    const idInput = screen.getByLabelText('ID');
    expect(idInput).toBeDisabled();

    fireEvent.input(screen.getByLabelText('Nombre'), { target: { value: 'Tarjeta Actualizada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    await waitFor(() => {
      expect(updateProduct).toHaveBeenCalledWith(product.id, {
        name: 'Tarjeta Actualizada',
        description: product.description,
        logo: product.logo,
        date_release: product.date_release,
        date_revision: product.date_revision
      });
    });
  });
});
