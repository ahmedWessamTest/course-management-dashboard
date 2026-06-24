import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideDynamicIcon, LucideCheckCircle, LucideXCircle } from '@lucide/angular';

@Component({
  selector: 'app-badge',
  templateUrl: './app-badge.component.html',
  styleUrl: './app-badge.component.css',
  imports: [LucideDynamicIcon, LucideCheckCircle, LucideXCircle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBadgeComponent {
  protected readonly LucideCheckCircle = LucideCheckCircle;
  protected readonly LucideXCircle = LucideXCircle;

  readonly status = input.required<boolean>();
}
