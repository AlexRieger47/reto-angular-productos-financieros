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

const sixProducts: Product[] = [
  ...products,
  {
    id: 'cta-ah',
    name: 'Cuenta Ahorro',
    description: 'Cuenta bancaria para ahorro',
    logo: 'assets-3.png',
    date_release: '2026-07-01',
    date_revision: '2027-07-01'
  },
  {
    id: 'seg-vid',
    name: 'Seguro Vida',
    description: 'Seguro de proteccion familiar',
    logo: 'assets-4.png',
    date_release: '2026-08-01',
    date_revision: '2027-08-01'
  },
  {
    id: 'inv-fix',
    name: 'Inversion Fija',
    description: 'Producto de inversion definido',
    logo: 'assets-5.png',
    date_release: '2026-09-01',
    date_revision: '2027-09-01'
  },
  {
    id: 'cre-veh',
    name: 'Credito Vehiculo',
    description: 'Credito para vehiculo nuevo',
    logo: 'assets-6.png',
    date_release: '2026-10-01',
    date_revision: '2027-10-01'
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
    expect(screen.getByText('1 de 1 Resultados')).toBeInTheDocument();
  });

  it('moves between result pages when there are more products than the selected page size', async () => {
    await render(ProductList, {
      providers: [
        provideRouter([]),
        {
          provide: ProductApi,
          useValue: {
            getProducts: jest.fn().mockReturnValue(of(sixProducts))
          }
        }
      ]
    });

    expect(screen.getByText('5 de 6 Resultados')).toBeInTheDocument();
    expect(screen.queryByText('Credito Vehiculo')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Página siguiente'));

    expect(screen.getByText('1 de 6 Resultados')).toBeInTheDocument();
    expect(screen.getByText('Credito Vehiculo')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '10' }
    });

    expect(screen.getByText('6 de 6 Resultados')).toBeInTheDocument();
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
