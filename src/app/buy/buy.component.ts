import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buy',
  imports: [CommonModule],
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.css'
})
export class BuyComponent {
  cartItems: any[] = [];

  constructor(private cartService: CartService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      if (items.length > 0) {
        this.getStockByIds(items);
      }
    });
    if (this.cartItems.length > 0) {
      this.getStockByIds();
    }
  }

  getStockByIds(items: any[] = []): void {
    const payload = items;
    this.apiService.getStockbyIds(payload).subscribe({
      next: (res: any) => {
        this.cartItems = res;
      },
      error: (error: any) => {}
    });
  }
}
