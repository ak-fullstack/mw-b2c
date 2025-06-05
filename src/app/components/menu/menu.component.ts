import { Component } from '@angular/core';
import { LoginService } from '../../../core/services/login.service'; 
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule,RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
    cartItems: any[] = [];

  constructor(private loginService: LoginService,private cartService: CartService) { }


  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      
    });
  }

  login() {
    this.loginService.show();
  }
}
