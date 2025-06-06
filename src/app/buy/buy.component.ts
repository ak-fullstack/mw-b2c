import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { RazorpayService } from '../../core/services/razorpay.service';
import {  FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddAddressComponent } from "../components/add-address/add-address.component";

@Component({
  selector: 'app-buy',
  imports: [CommonModule, AddAddressComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.css'
})
export class BuyComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  items: any[] = [];
  myProfile: any = undefined;
  private cartSubscription: any;
  addAddressDialog: boolean = false;


  orderForm = new FormGroup({
    recipientName: new FormControl('', [Validators.required]),
    recipientPhone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]$'),]),
    shippingAddressId: new FormControl('', [Validators.required]),
    billingAddressId: new FormControl('', [Validators.required]),
    billingSameAsShipping: new FormControl(true),
    items: new FormControl([], [Validators.required]),
  });

  constructor(private cartService: CartService, private apiService: ApiService, private razorpayService: RazorpayService) { }


  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.items = items;
      this.getStockByIds(this.items);
    });
    this.getMyProfile();

    this.orderForm.valueChanges.subscribe(value => {
      console.log(value);
      
    })
    // this.makePayment('order_ABC123XYZ');
  }

  addCustomerAddress() {

  }

  getMyProfile() {
    this.apiService.getMyProfile().subscribe({
      next: (res: any) => {
        this.myProfile = res;
        this.orderForm.patchValue({
          recipientName: this.myProfile.fullName,
          recipientPhone: this.myProfile.phone,
        })
      }
    });
  }

  getStockByIds(items: any[] = []): void {
    const payload = items;
    this.apiService.getStockbyIds(payload).subscribe({
      next: (res: any) => {
        this.cartItems = res;
      },
      error: (error: any) => { }
    });
  }


  makePayment(orderId: string) {
    const orderDetails = {
      currency: 'INR',
      name: 'Your Company',
      description: 'Product/Service Description',
      order_id: orderId,
      prefill: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#F37254'
      }
    };

    this.razorpayService.payWithRazor(orderDetails, (response: any) => {
      console.log('Payment successful:', response);
      // handle success
    }, (error: any) => {
      console.error('Payment failed or closed:', error);
      // handle failure or dismissal
    });
  }

  removeCartItem(item: any): void {
    this.cartService.removeFromCart(item);
  }




  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }


}
