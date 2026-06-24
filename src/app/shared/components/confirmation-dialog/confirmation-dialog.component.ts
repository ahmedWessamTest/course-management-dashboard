import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmationDialogService } from '@core/services/confirmation-dialog.service';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [isOpen]="dialogService.isOpen()"
      [title]="dialogService.config()?.title || ''"
      [message]="dialogService.config()?.message || null"
      [confirmLabel]="dialogService.config()?.confirmLabel || 'Confirm'"
      [cancelLabel]="dialogService.config()?.cancelLabel || 'Cancel'"
      [variant]="dialogService.config()?.variant || 'default'"
      (onConfirm)="dialogService.onConfirm()"
      (onCancel)="dialogService.onCancel()"
    />
  `,
})
export class ConfirmationDialogComponent {
  readonly dialogService = inject(ConfirmationDialogService);
}
