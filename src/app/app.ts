import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideBookOpen } from '@lucide/angular';
import { NotificationToastComponent } from './shared/components/notification-toast/notification-toast.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideBookOpen,
    NotificationToastComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
