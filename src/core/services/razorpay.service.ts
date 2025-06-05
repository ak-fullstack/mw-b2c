import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {


  constructor() {}

  payWithRazor(orderDetails: {
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    theme?: {
      color: string;
    };
  }, onSuccess: (response: any) => void, onFailure?: (error: any) => void) {

    const options: any = {
      key: environment.razorPaykeyId,
      currency: orderDetails.currency,
      name: orderDetails.name,
      description: orderDetails.description,
      order_id: orderDetails.order_id,
      prefill: orderDetails.prefill,
      theme: orderDetails.theme || { color: '#3399cc' },
      handler: function (response: any) {
        onSuccess(response);
      },
      modal: {
        ondismiss: function () {
          if (onFailure) {
            onFailure({ message: 'Payment popup closed' });
          }
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }
}
