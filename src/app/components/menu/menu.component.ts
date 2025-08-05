import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
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

  constructor(private loginService: LoginService,private cartService: CartService,private apiService:ApiService,private el: ElementRef, private renderer: Renderer2) { }


  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      // console.log(items);
      
      this.cartItems = items;
      // console.log(this.cartItems);
      
    });
    this.loginService.isLoggedIn$.subscribe(isLoggedIn => {      
      this.isLoggedIn = isLoggedIn;      
    });
  }

  login() {
    this.loginService.show();
  }

   @HostListener('window:scroll', [])
  onScroll() {
    const navbar = this.el.nativeElement.querySelector('.menubar');
    if (window.scrollY > 1) {
      this.renderer.setStyle(navbar, 'background', 'rgba(0, 0, 0, 0.884)');
    } else {
      this.renderer.setStyle(navbar, 'background', 'transparent');
    }
  }

  
}
