import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Course } from '@core/models/course.model';
import { CourseService } from './course.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class CourseStateService {
  private readonly courseService = inject(CourseService);
  private readonly notificationService = inject(NotificationService);

  readonly courses = signal<Course[]>([]);

  readonly loading = signal<boolean>(false);

  readonly error = signal<string | null>(null);

  readonly selectedCourse = signal<Course | null>(null);

  readonly publishedCount = computed(() => this.courses().filter((c) => c.status).length);
  readonly unpublishedCount = computed(() => this.courses().filter((c) => !c.status).length);

  loadCourses(): Observable<Course[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.courseService.getAll().pipe(
      tap({
        next: (courses) => {
          this.courses.set(courses);
          this.loading.set(false);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      }),
    );
  }

  selectCourse(id: string): Observable<Course> {
    this.loading.set(true);
    this.error.set(null);

    return this.courseService.getById(id).pipe(
      tap({
        next: (course) => {
          this.selectedCourse.set(course);
          this.loading.set(false);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      }),
    );
  }

  clearSelected(): void {
    this.selectedCourse.set(null);
  }

  deleteCourse(id: string): Observable<Course> {
    const snapshot = this.courses();
    this.courses.update((list) => list.filter((c) => c.id !== id));

    return this.courseService.delete(id).pipe(
      tap({
        next: () => {
          this.notificationService.success('Course deleted successfully.');
        },
        error: (err: Error) => {
          this.courses.set(snapshot); // rollback
          this.notificationService.error(err.message);
        },
      }),
    );
  }

  toggleStatus(id: string, status: boolean): Observable<Course> {
    const snapshot = this.courses();
    this.courses.update((list) => list.map((c) => (c.id === id ? { ...c, status } : c)));

    return this.courseService.update(id, { status }).pipe(
      tap({
        next: () => {
          this.notificationService.success(status ? 'Course published.' : 'Course unpublished.');
        },
        error: (err: Error) => {
          this.courses.set(snapshot);
          this.notificationService.error(err.message);
        },
      }),
    );
  }
}
