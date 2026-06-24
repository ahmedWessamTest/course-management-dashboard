import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { LucideAlertCircle, LucideInbox, LucideRotateCcw } from '@lucide/angular';

@Component({
  selector: 'app-empty-error-state',
  templateUrl: './empty-error-state.component.html',
  styleUrl: './empty-error-state.component.css',
  imports: [LucideAlertCircle, LucideInbox, LucideRotateCcw],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyErrorStateComponent {
  readonly loading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly empty = input<boolean>(false);
  readonly emptyTitle = input<string>('No data found');
  readonly emptyMessage = input<string>('There is nothing here yet.');
  readonly errorTitle = input<string>('Something went wrong');

  readonly retry = output<void>();

  readonly activeState = computed<'loading' | 'error' | 'empty' | 'idle'>(() => {
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    if (this.empty()) return 'empty';
    return 'idle';
  });
}
