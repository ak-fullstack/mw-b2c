import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { RazorpayService } from '../../../core/services/razorpay.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddAddressComponent } from "../../components/add-address/add-address.component";
import { EditAddressComponent } from "../../components/edit-address/edit-address.component";
import { environment } from '../../../environments/environment';
import { NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-buy',
  imports: [CommonModule, AddAddressComponent, FormsModule, ReactiveFormsModule, EditAddressComponent, RouterModule],
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.css'
})
export class BuyComponent implements OnInit, OnDestroy {
  // cartItems: any[] = [];
  myProfile: any = undefined;
  private cartSubscription: any;
  addAddressDialog: boolean = false;
  editAddressDialog: boolean = false;
  paymentSuccess = false;
  paymentDate = new Date();
  calculatedResults: any;



  orderForm = new FormGroup({
    shippingName: new FormControl('', [Validators.required]),
    shippingPhoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]{10}$')
    ]),
    shippingEmailId: new FormControl('', [Validators.required, Validators.email]),
    shippingAddressId: new FormControl<any>('', [Validators.required]),
    billingAddressId: new FormControl<any>('', [Validators.required]),
    billingSameAsShipping: new FormControl(true),
    items: new FormControl<any>([]),
    paymentSource: new FormControl<any>('full')
  });

  constructor(private cartService: CartService, private apiService: ApiService, private razorpayService: RazorpayService, private ngZone: NgZone) { }


  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {

      this.getStockByIds(items);
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

    this.orderForm.get('shippingAddressId')?.valueChanges.subscribe((selectedId) => {
      const selectedAddress = this.myProfile.addresses.find((a: any) => a.id === selectedId);
      this.myProfile.shippingAddress = selectedAddress;
      this.calculateOrder();
    });

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
          shippingName: this.myProfile.fullName,
          shippingPhoneNumber: this.myProfile.phoneNumber,
          shippingEmailId: this.myProfile.emailId
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
        this.calculateOrder();
      },
      error: (error: any) => { }
    });
  }

  paymentDetails: any;
  payWithRazorPay(orderDetails: any) {
    const payload = {
      currency: 'INR',
      name: environment.companyName,
      description: 'E-Commerce',
      order_id: orderDetails.razorpayOrderId,
      prefill: {
        name: orderDetails.name,
        email: orderDetails.email,
        contact: orderDetails.contact
      },
      theme: {
        color: '#F37254'
      }
    };

    this.razorpayService.payWithRazorPay(payload).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          console.log('Payment success:', response);
          this.paymentDetails = response;
          this.paymentSuccess = true;
          this.cartService.clearCart();
        });

      },
      error: (error) => {
        console.log('Payment failed or dismissed:', error);
        // handle failure logic
      },
      complete: () => {
        console.log('Payment observable completed');
      }
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

  createOrder() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    const formValue = this.orderForm.value;

    const sanitizedItems = formValue.items.map((item: any) => ({
      stockId: item.stockId,
      quantity: item.quantity
    }));

    const payload = {
      ...formValue,
      items: sanitizedItems
    };
    this.apiService.createOrder(payload).subscribe({
      next: (res: any) => {
        if (res.razorpayOrderId === null) {
          this.getWalletOrderConfirmation(res.orderId);
        }
        else {
          this.payWithRazorPay(res)

        }
      },
      error: (error: any) => {

      }
    })
  }

  getWalletOrderConfirmation(orderId: any) {
    this.apiService.getWalletorderConfiramtion(orderId).subscribe({
      next: (res) => {
        this.paymentDetails = res;
          this.paymentSuccess = true;
          this.cartService.clearCart();
       }
    })

  }

  calculateOrder() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    const formValue = this.orderForm.value;

    const sanitizedItems = formValue.items.map((item: any) => ({
      stockId: item.stockId,
      quantity: item.quantity
    }));

    const payload = {
      ...formValue,
      items: sanitizedItems,
      shippingState: this.myProfile?.shippingAddress?.state,
    };
    this.apiService.calculateOrder(payload).subscribe({
      next: (res: any) => {
        this.calculatedResults = res;

      },
      error: (error: any) => {

      }
    })
  }


  setPaymentSource(source: 'razorpay' | 'wallet') {
    this.orderForm.patchValue({ paymentSource: source });
  }




}
