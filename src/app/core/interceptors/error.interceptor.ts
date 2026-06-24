import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred. Please try again.';

      if (error.status === 0) {
        message = 'Network error — please check your connection.';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.status === 400) {
        message = 'Bad request — please check the submitted data.';
      } else if (error.status === 500) {
        message = 'Server error — please try again later.';
      } else if (error.error?.message) {
        message = error.error.message as string;
      }

      return throwError(() => new Error(message));
    }),
  );
};
