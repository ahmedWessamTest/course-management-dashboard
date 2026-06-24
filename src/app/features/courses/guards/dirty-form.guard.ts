import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { CourseFormPage } from '@features/courses/pages/course-form/course-form.page';
import { ConfirmationDialogService } from '@core/services/confirmation-dialog.service';

export const dirtyFormGuard: CanDeactivateFn<CourseFormPage> = (component) => {
  if (component.form.dirty) {
    const dialogService = inject(ConfirmationDialogService);
    return dialogService.confirm({
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to leave this page?',
      confirmLabel: 'Leave',
      cancelLabel: 'Keep Editing',
      variant: 'danger',
    });
  }
  return true;
};
