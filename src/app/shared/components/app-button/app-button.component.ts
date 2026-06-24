import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { LucideLoader2 } from '@lucide/angular';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.css',
  imports: [LucideLoader2],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
}
