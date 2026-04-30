import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';

import { Product } from '../../../core/models/product.model';
import { getApiErrorMessage, ProductApi } from '../../../core/services/product-api';

@Component({
  selector: 'app-product-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductList implements OnInit {
  private readonly api = inject(ProductApi);

  protected readonly products = signal<Product[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly pageSize = signal(5);
  protected readonly currentPage = signal(0);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly activeMenuId = signal<string | null>(null);

  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.products();
    }

    return this.products().filter((product) =>
      [product.id, product.name, product.description]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize()))
  );

  protected readonly visibleProducts = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  protected readonly canGoPrevious = computed(() => this.currentPage() > 0);
  protected readonly canGoNext = computed(() => this.currentPage() < this.totalPages() - 1);

  ngOnInit(): void {
    this.loadProducts();
  }

  protected updateSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(0);
    this.activeMenuId.set(null);
  }

  protected updatePageSize(value: string): void {
    this.pageSize.set(Number(value));
    this.currentPage.set(0);
    this.activeMenuId.set(null);
  }

  protected goPrevious(): void {
    this.currentPage.update((page) => Math.max(0, page - 1));
    this.activeMenuId.set(null);
  }

  protected goNext(): void {
    this.currentPage.update((page) => Math.min(this.totalPages() - 1, page + 1));
    this.activeMenuId.set(null);
  }

  protected toggleMenu(productId: string): void {
    this.activeMenuId.update((activeId) => (activeId === productId ? null : productId));
  }

  protected initials(product: Product): string {
    return product.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  protected trackById(_index: number, product: Product): string {
    return product.id;
  }

  private loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.api
      .getProducts()
      .pipe(take(1))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          this.errorMessage.set(getApiErrorMessage(error));
          this.isLoading.set(false);
        }
      });
  }
}
