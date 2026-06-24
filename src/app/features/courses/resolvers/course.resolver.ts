import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { Course } from '@core/models/course.model';
import { CourseService } from '@core/services/course.service';

export const courseResolver: ResolveFn<Course> = (route) => {
  const courseService = inject(CourseService);
  const router = inject(Router);
  const id = route.paramMap.get('id')!;

  return courseService.getById(id).pipe(
    catchError(() => {
      router.navigate(['/courses']);
      return EMPTY;
    }),
  );
};
