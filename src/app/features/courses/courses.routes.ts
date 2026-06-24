import { Routes } from '@angular/router';
import { dirtyFormGuard } from './guards/dirty-form.guard';
import { courseResolver } from './resolvers/course.resolver';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/courses-list/courses-list.page').then((m) => m.CoursesListPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/course-form/course-form.page').then((m) => m.CourseFormPage),
    canDeactivate: [dirtyFormGuard],
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/course-form/course-form.page').then((m) => m.CourseFormPage),
    canDeactivate: [dirtyFormGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/course-details/course-details.page').then((m) => m.CourseDetailsPage),
    resolve: { course: courseResolver },
  },
];
