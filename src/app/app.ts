import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationToastComponent } from './shared/components/notification-toast/notification-toast.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationToastComponent, ConfirmationDialogComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
