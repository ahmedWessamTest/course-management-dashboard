import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

export interface ConfirmationDialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
}

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  readonly isOpen = signal<boolean>(false);
  readonly config = signal<ConfirmationDialogConfig | null>(null);

  private readonly confirmed$ = new Subject<boolean>();

  /** Open confirmation dialog and return Observable that emits the result */
  confirm(config: ConfirmationDialogConfig): Observable<boolean> {
    this.config.set(config);
    this.isOpen.set(true);
    return this.confirmed$.pipe(take(1));
  }

  /** User clicked confirm */
  onConfirm(): void {
    this.confirmed$.next(true);
    this.close();
  }

  /** User clicked cancel */
  onCancel(): void {
    this.confirmed$.next(false);
    this.close();
  }

  /** Close dialog */
  private close(): void {
    this.isOpen.set(false);
    this.config.set(null);
  }
}
