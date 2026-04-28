import { fireEvent, render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Product } from '../../../core/models/product.model';
import { ProductApi } from '../../../core/services/product-api';
import { ProductList } from './product-list';

const products: Product[] = [
  {
    id: 'trj-crd',
    name: 'Tarjeta Credito',
    description: 'Tarjeta de consumo',
    logo: 'assets-1.png',
    date_release: '2026-05-01',
    date_revision: '2027-05-01'
  },
  {
    id: 'cta-deb',
    name: 'Cuenta Debito',
    description: 'Cuenta bancaria diaria',
    logo: 'assets-2.png',
    date_release: '2026-06-01',
    date_revision: '2027-06-01'
  }
];

describe('ProductList', () => {
  it('renders products and filters by search term', async () => {
    await render(ProductList, {
      providers: [
        provideRouter([]),
        {
          provide: ProductApi,
          useValue: {
            getProducts: jest.fn().mockReturnValue(of(products))
          }
        }
      ]
    });

    expect(screen.getByText('Tarjeta Credito')).toBeInTheDocument();
    expect(screen.getByText('Cuenta Debito')).toBeInTheDocument();

    fireEvent.input(screen.getByRole('searchbox'), {
      target: { value: 'debito' }
    });

    expect(screen.queryByText('Tarjeta Credito')).not.toBeInTheDocument();
    expect(screen.getByText('Cuenta Debito')).toBeInTheDocument();
    expect(screen.getByText('1 Resultados')).toBeInTheDocument();
  });

  it('shows the edit action from the contextual menu', async () => {
    await render(ProductList, {
      providers: [
        provideRouter([]),
        {
          provide: ProductApi,
          useValue: {
            getProducts: jest.fn().mockReturnValue(of(products))
          }
        }
      ]
    });

    fireEvent.click(screen.getAllByTitle('Abrir acciones')[0]);

    expect(screen.getByRole('menuitem', { name: 'Editar' })).toHaveAttribute(
      'href',
      '/products/trj-crd/edit'
    );
  });
});
