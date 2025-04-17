import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { api } from '../../constants/api-urls';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) {}

  getUserRoles(): Observable<any> {
    return this.http.get(api.admin.getRoles);
  }

  getAllPermissions(): Observable<any> {
    return this.http.get(api.admin.getPermissions);
  }


  sendOtp(payload:any):Observable<any>{
    return this.http.post(api.admin.sendOtp, payload);
  }

  verifyOtp(payload:any):Observable<any>{
    return this.http.post(api.admin.verifyOtp, payload);
  }

  createRole(payload:any):Observable<any>{
    return this.http.post(api.admin.createRole, payload);
  }

  getAllRolesWithPermissions(): Observable<any> {
    return this.http.get(api.admin.getallRolesWithPermissions);
  }

  uploadUserProfile(payload:any):Observable<any>{
    return this.http.post(api.admin.uploadUserImage, payload);
  }

  addNewUser(payload:any):Observable<any>{
    return this.http.post(api.admin.addNewUser, payload);
  } 

  getAllUsers(): Observable<any> {
    return this.http.get(api.admin.getAllUsers);
  }

  verifyOauthToken(payload:any): Observable<any> {
    return this.http.post(api.customer.verifyOauthToken, payload);
  }

  sendCustomerEmailOtp(payload:any): Observable<any> {
    return this.http.post(api.customer.sendCustomeEmailOtp, payload);
  }

  verifyCustomerEmailOtp(payload:any): Observable<any> {
    return this.http.post(api.customer.verifyCustomerEmailOtp, payload);
  }

  createCustomer(payload:any): Observable<any> {
    return this.http.post(api.customer.createCustomer, payload);
  }

  customerLogin(payload:any): Observable<any> {
    return this.http.post(api.customer.loginCustomer, payload);
  }

}