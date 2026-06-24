import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideBookOpen } from '@lucide/angular';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, LucideBookOpen],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {}
