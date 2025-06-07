import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { RazorpayService } from '../../core/services/razorpay.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddAddressComponent } from "../components/add-address/add-address.component";
import { EditAddressComponent } from "../components/edit-address/edit-address.component";

@Component({
  selector: 'app-buy',
  imports: [CommonModule, AddAddressComponent, FormsModule, ReactiveFormsModule, EditAddressComponent],
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.css'
})
export class BuyComponent implements OnInit, OnDestroy {
  // cartItems: any[] = [];
  items: any[] = [];
  myProfile: any = undefined;
  private cartSubscription: any;
  addAddressDialog: boolean = false;
  editAddressDialog: boolean = false;


  orderForm = new FormGroup({
    recipientName: new FormControl('', [Validators.required]),
    recipientPhone: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]{10}$')
    ]),
    shippingAddressId: new FormControl<any>('', [Validators.required]),
    billingAddressId: new FormControl<any>('', [Validators.required]),
    billingSameAsShipping: new FormControl(true),
    items: new FormControl<any>([]),
  });

  constructor(private cartService: CartService, private apiService: ApiService, private razorpayService: RazorpayService) { }


  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.items = items;
      if(this.items.length>0){
        this.getStockByIds(this.items);
      }
    });
    this.getMyProfile();

    this.orderForm.get('shippingAddressId')?.valueChanges.subscribe((shippingAddressId) => {
      if (this.orderForm.get('billingSameAsShipping')?.value) {
        this.orderForm.get('billingAddressId')?.setValue(shippingAddressId);
      }
    });

    this.orderForm.get('billingSameAsShipping')?.valueChanges.subscribe((billingSameAsShipping) => {
      if (billingSameAsShipping) {
        this.orderForm.get('billingAddressId')?.setValue(this.orderForm.get('shippingAddressId')?.value);
      }
    })

    // this.makePayment('order_ABC123XYZ');
  }

  selectedAddress: any = undefined;

  editAddress(address: any) {
    this.selectedAddress = address;
    this.editAddressDialog = true;
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
        // this.cartItems = res;
        this.orderForm.get('items')?.setValue(res);
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


  get cartSubTotal(): number {
    return this.formItems.reduce((total: any, item: any) => total + item.sp * item.quantity, 0);
  }

  get cartTotalTax(): number {
    if (!this.myProfile?.shippingAddress?.gstType) return 0;

    const gstType = this.myProfile.shippingAddress.gstType;

    return this.formItems.reduce((total: any, item: any) => {
      const subTotal = item.sp * item.quantity;

      if (gstType === 'CGST_SGST') {
        const gstPercent = item.cgst + item.sgst;
        const gstAmount = (subTotal * gstPercent) / 100;
        return total + gstAmount;
      } else if (gstType === 'IGST') {
        const gstPercent = item.igst;
        const gstAmount = (subTotal * gstPercent) / 100;
        return total + gstAmount;
      }

      return total;
    }, 0);
  }

  get formItems() {
    return this.orderForm.get('items')?.value || [];
  }
}
