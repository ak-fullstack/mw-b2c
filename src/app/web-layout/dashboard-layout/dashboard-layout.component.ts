import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule,RouterModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {

  sidebarMenu = [
  { label: 'Profile', route: 'profile' },
  { label: 'Orders', route: 'orders' },
  // { label: 'Stock Notifications', route: 'stock-notifications' },
];

constructor(public loginService:LoginService)
{

}
}
