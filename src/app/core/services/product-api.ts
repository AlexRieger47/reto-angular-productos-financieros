import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  Product,
  ProductMutationResponse,
  ProductPayload,
  ProductsResponse
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/bp/products';

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ProductsResponse>(this.baseUrl)
      .pipe(map((response) => response.data ?? []));
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }

  createProduct(product: Product): Observable<ProductMutationResponse<Product>> {
    return this.http.post<ProductMutationResponse<Product>>(this.baseUrl, product);
  }

  updateProduct(
    id: string,
    product: ProductPayload
  ): Observable<ProductMutationResponse<ProductPayload>> {
    return this.http.put<ProductMutationResponse<ProductPayload>>(
      `${this.baseUrl}/${encodeURIComponent(id)}`,
      product
    );
  }

  verifyIdentifier(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${encodeURIComponent(id)}`);
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const serverMessage =
      typeof error.error === 'object' && error.error !== null && 'message' in error.error
        ? String(error.error.message)
        : '';

    return serverMessage || 'No se pudo completar la operación. Intenta nuevamente.';
  }

  return 'Ocurrió un error inesperado.';
}
