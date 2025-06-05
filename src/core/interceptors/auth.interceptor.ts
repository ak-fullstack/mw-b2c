import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private loginService:LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token = localStorage.getItem('token');

      const authReq = req.clone({
    withCredentials: true
  });
    // if (token) {
    //   authReq = req.clone({
    //     setHeaders: { Authorization: `Bearer ${token}` }
    //   });
    // }
    

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          const currentUrl = this.router.url;
          localStorage.setItem('redirectAfterLogin', currentUrl);
          this.loginService.show();
        }
        return throwError(() => error);
      })
    );
  }
}
