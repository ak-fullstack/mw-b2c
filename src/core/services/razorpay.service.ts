import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {


  constructor() {}

 payWithRazorPay(orderDetails: any): Observable<any> {
  return new Observable(observer => {
    const options: any = {
      key: environment.razorPaykeyId,
      ...orderDetails,
      handler: (response: any) => {
        // Payment successful
        observer.next(response);
        observer.complete();
      },
      modal: {
        ondismiss: () => {
          // Payment popup closed or dismissed — treat as failure
          observer.error({ message: 'Payment popup closed' });
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();

    // Optional cleanup when unsubscribed
    return () => {
      // If you want, you can close the popup on unsubscribe here
      // rzp.close();  // Uncomment if needed
    };
  });
}
}
