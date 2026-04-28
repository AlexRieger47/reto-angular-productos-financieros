import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductApi } from './product-api';
import { Product } from '../models/product.model';

const product: Product = {
  id: 'trj-crd',
  name: 'Tarjeta Credito',
  description: 'Tarjeta de consumo',
  logo: 'assets-1.png',
  date_release: '2026-05-01',
  date_revision: '2027-05-01'
};

describe('ProductApi', () => {
  let service: ProductApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductApi, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ProductApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('gets financial products', () => {
    service.getProducts().subscribe((products) => {
      expect(products).toEqual([product]);
    });

    const request = http.expectOne('/bp/products');
    expect(request.request.method).toBe('GET');
    request.flush({ data: [product] });
  });

  it('creates a financial product', () => {
    service.createProduct(product).subscribe((response) => {
      expect(response.message).toBe('Product added successfully');
      expect(response.data).toEqual(product);
    });

    const request = http.expectOne('/bp/products');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(product);
    request.flush({ message: 'Product added successfully', data: product });
  });

  it('updates a financial product without sending the id in the payload', () => {
    const { id, ...payload } = product;

    service.updateProduct(id, payload).subscribe((response) => {
      expect(response.data).toEqual(payload);
    });

    const request = http.expectOne('/bp/products/trj-crd');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(payload);
    request.flush({ message: 'Product updated successfully', data: payload });
  });

  it('verifies product id existence', () => {
    service.verifyIdentifier('trj-crd').subscribe((exists) => {
      expect(exists).toBe(true);
    });

    const request = http.expectOne('/bp/products/verification/trj-crd');
    expect(request.request.method).toBe('GET');
    request.flush(true);
  });
});
