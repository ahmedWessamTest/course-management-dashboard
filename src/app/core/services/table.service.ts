import { computed, Injectable, signal } from '@angular/core';
import { Course } from '@core/models/course.model';

export type SortDirection = 'asc' | 'desc' | null;

@Injectable({ providedIn: 'root' })
export class TableService {
  readonly searchQuery = signal<string>('');
  readonly statusFilter = signal<boolean | null>(null);
  readonly sortColumn = signal<keyof Course | null>(null);
  readonly sortDirection = signal<SortDirection>(null);
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(10);

  setSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  setStatusFilter(status: boolean | null): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
  }

  setSort(column: keyof Course): void {
    if (this.sortColumn() === column) {
      const next: SortDirection =
        this.sortDirection() === 'asc' ? 'desc' : this.sortDirection() === 'desc' ? null : 'asc';
      this.sortDirection.set(next);
      if (next === null) this.sortColumn.set(null);
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  filteredData(source: () => Course[]): () => Course[] {
    return computed(() => {
      let data = [...source()];
      const query = this.searchQuery().toLowerCase().trim();
      const status = this.statusFilter();
      const col = this.sortColumn();
      const dir = this.sortDirection();
      const page = this.currentPage();
      const size = this.pageSize();

      if (query) {
        data = data.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.instructor.toLowerCase().includes(query) ||
            c.category.toLowerCase().includes(query),
        );
      }

      if (status !== null) {
        data = data.filter((c) => c.status === status);
      }

      if (col && dir) {
        data = data.sort((a, b) => {
          const av = a[col] as string | number | boolean;
          const bv = b[col] as string | number | boolean;
          if (av < bv) return dir === 'asc' ? -1 : 1;
          if (av > bv) return dir === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return data.slice((page - 1) * size, page * size);
    });
  }

  filteredCount(source: () => Course[]): () => number {
    return computed(() => {
      let data = source();
      const query = this.searchQuery().toLowerCase().trim();
      const status = this.statusFilter();

      if (query) {
        data = data.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.instructor.toLowerCase().includes(query) ||
            c.category.toLowerCase().includes(query),
        );
      }

      if (status !== null) {
        data = data.filter((c) => c.status === status);
      }

      return data.length;
    });
  }

  reset(): void {
    this.searchQuery.set('');
    this.statusFilter.set(null);
    this.sortColumn.set(null);
    this.sortDirection.set(null);
    this.currentPage.set(1);
  }
}
