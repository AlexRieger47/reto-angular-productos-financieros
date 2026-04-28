export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export type ProductPayload = Omit<Product, 'id'>;

export interface ProductsResponse {
  data: Product[];
}

export interface ProductMutationResponse<T> {
  message: string;
  data: T;
}
