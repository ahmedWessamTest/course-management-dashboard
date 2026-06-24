import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId()"
      >
        <div class="modal">
          <h3 [id]="titleId()" class="modal-title">
            {{ title() }}
          </h3>
          @if (message()) {
            <p class="modal-body">
              {{ message() }}
            </p>
          }
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="onCancel.emit()" type="button">
              {{ cancelLabel() }}
            </button>
            <button
              [class]="'btn ' + (variant() === 'danger' ? 'btn-danger' : 'btn-primary')"
              (click)="onConfirm.emit()"
              type="button"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .modal {
        background: #fff;
        border-radius: var(--radius-lg);
        padding: 28px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.2s ease-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .modal-title {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--gray-900);
        margin: 0 0 8px;
      }

      .modal-body {
        color: var(--gray-600);
        font-size: 0.9rem;
        margin: 0 0 20px;
      }

      .modal-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 9px 16px;
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: background 0.2s;
      }

      .btn-primary {
        background: var(--primary);
        color: #fff;
      }

      .btn-primary:hover {
        background: var(--primary-text);
      }

      .btn-secondary {
        background: var(--gray-100);
        color: var(--gray-700);
      }

      .btn-secondary:hover {
        background: var(--gray-200);
      }

      .btn-danger {
        background: var(--danger);
        color: #fff;
      }

      .btn-danger:hover {
        background: #b91c1c;
      }
    `,
  ],
})
export class ModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly title = input.required<string>();
  readonly message = input<string | null>(null);
  readonly confirmLabel = input<string>('Confirm');
  readonly cancelLabel = input<string>('Cancel');
  readonly variant = input<'default' | 'danger'>('default');
  readonly titleId = input<string>('modal-title');

  readonly onConfirm = output<void>();
  readonly onCancel = output<void>();
}
