import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { LucideDynamicIcon, LucideCheckCircle, LucideAlertCircle, LucideX, LucideInfo } from '@lucide/angular';
import { NotificationService, AppNotification } from '@core/services/notification.service';

@Component({
  selector: 'app-notification-toast',
  templateUrl: './notification-toast.component.html',
  styleUrl: './notification-toast.component.css',
  imports: [LucideDynamicIcon, LucideX],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationToastComponent {
  protected readonly notificationService = inject(NotificationService);
  protected iconFor(n: AppNotification): any {
    if (n.type === 'success') return LucideCheckCircle;
    if (n.type === 'error') return LucideAlertCircle;
    return LucideInfo;
  }
}
