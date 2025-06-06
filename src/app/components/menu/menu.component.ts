import { Component } from '@angular/core';
import { LoginService } from '../../../core/services/login.service'; 
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule,RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
    cartItems: any[] = [];
    isLoggedIn: boolean = false;

  constructor(private loginService: LoginService,private cartService: CartService,private apiService:ApiService) { }


  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      
    });
    this.loginService.isLoggedIn$.subscribe(isLoggedIn => {      
      this.isLoggedIn = isLoggedIn;      
    });
  }

  login() {
    this.loginService.show();
  }

  logout(){
    this.apiService.logout().subscribe({
      next: (res: any) => {
          this.loginService.updateLoginStatus(false);
      },
      error: (error: any) => {
        
      }
    });
  }
}
