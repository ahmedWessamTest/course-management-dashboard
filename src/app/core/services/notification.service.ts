import { computed, Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _counter = 0;
  readonly notifications = signal<AppNotification[]>([]);

  success(message: string): void {
    this._show('success', message);
  }

  error(message: string): void {
    this._show('error', message);
  }

  info(message: string): void {
    this._show('info', message);
  }

  dismiss(id: number): void {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }

  private _show(type: NotificationType, message: string): void {
    const id = ++this._counter;
    this.notifications.update((list) => [...list, { id, type, message }]);
    setTimeout(() => this.dismiss(id), 3000);
  }
}
