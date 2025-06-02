import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private items: any[] = [];

 addToCart(item: any) {
  const alreadyExists = this.items.some(existing => existing.stockId === item.stockId);
  
  if (!alreadyExists) {
    this.items.push(item);
    this.cartItemsSubject.next(this.items);
  } else {
    console.log('Item already in cart:', item.stockId);
  }
}

removeFromCart(item: any) {
  this.items = this.items.filter(existing => existing.stockId !== item.stockId);
  this.cartItemsSubject.next(this.items);
}

  getItems() {
    return [...this.items];
  }

  clearCart() {
    this.items = [];
    this.cartItemsSubject.next(this.items);
  }
}
