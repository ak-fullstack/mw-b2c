import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { api } from '../../constants/api-urls';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) {}


  verifyOauthToken(payload: any): Observable<any> {
  return this.http.post(api.customer.verifyOauthToken, payload, {
    withCredentials: true, 
  });
}

  sendCustomerEmailOtp(payload:any): Observable<any> {
    return this.http.post(api.customer.sendCustomerEmailOtpForRegistration, payload);
  }

  verifyCustomerEmailOtp(payload:any): Observable<any> {
    return this.http.post(api.customer.verifyCustomerEmailOtp, payload);
  }

  createCustomer(payload:any): Observable<any> {
    return this.http.post(api.customer.createCustomer, payload);
  }

customerLogin(payload: any): Observable<any> {
  return this.http.post(api.customer.loginCustomer, payload, {
    withCredentials: true,
  });
}

  sendResetOtp(payload:any): Observable<any> {
    return this.http.post(api.customer.sendResetOtp, payload);
  }

  updateCustomer(payload:any): Observable<any> {
    return this.http.post(api.customer.updateCustomer, payload);
  }
  
  getLatestStockPerProduct(): Observable<any> {
    return this.http.get(api.product.getLatestStockPerProduct,{});
  }

  getStockbyIds(payload: any): Observable<any> {
    return this.http.post(api.product.getStocksByIds, payload);
  }

  getMyProfile(): Observable<any> {
    return this.http.get(api.customer.getProfile);
  }

  addCustomerAddress(payload: any): Observable<any> {
    return this.http.post(api.customer.address, payload);
  }

  getAllStates(): Observable<any> {
    return this.http.get(api.customer.getAllStates);
  }

  logout(): Observable<any> {
    return this.http.post(api.customer.logout, {});
  }
}