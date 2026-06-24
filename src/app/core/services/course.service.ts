import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CreateCourseDto, UpdateCourseDto } from '@core/models/course.model';
import { environment } from '@env/environment';
import { EAPIEndpoints } from '@core/bases/endpoints.enums';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl + EAPIEndpoints.courses;

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  getById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateCourseDto): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateCourseDto): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<Course> {
    return this.http.delete<Course>(`${this.baseUrl}/${id}`);
  }
}
