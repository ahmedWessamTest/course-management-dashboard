import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@core/models/category.model';
import { environment } from '@env/environment';
import { EAPIEndpoints } from '@core/bases/endpoints.enums';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl + EAPIEndpoints.categories;

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }
}
