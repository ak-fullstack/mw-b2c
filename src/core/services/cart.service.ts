import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart-items';
  private cartItemsSubject = new BehaviorSubject<any[]>(this.loadCartFromStorage());
  cartItems$ = this.cartItemsSubject.asObservable();

  private items: any[] = this.loadCartFromStorage();

  private loadCartFromStorage(): any[] {
    const data = localStorage.getItem(this.cartKey);
    return data ? JSON.parse(data) : [];
  }

  private updateStorage() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.items));
  }

  addToCart(item: any) {
    const alreadyExists = this.items.some(existing => existing.stockId === item.stockId);

    if (!alreadyExists) {
      this.items.push(item);
      this.updateStorage();
      this.cartItemsSubject.next([...this.items]);
    } else {
      console.log('Item already in cart:', item.stockId);
    }
  }

  removeFromCart(item: any) {
    console.log(item);
    console.log(this.items);
    
    
    this.items = this.items.filter(existing => existing.stockId !== item.stockId);
    console.log(this.items);
    
    this.updateStorage();
    this.cartItemsSubject.next([...this.items]);
  }

  getItems() {
    return [...this.items];
  }

  clearCart() {
    this.items = [];
    localStorage.removeItem(this.cartKey);
    this.cartItemsSubject.next([]);
  }
}