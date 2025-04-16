import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service'; 
import { ToastService } from '../services/toast.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService,private toast:ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    this.loaderService.show(); // Show loader before request starts
    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) { 
            // Successful response
          }
        },
        error: (error) => { 
          if (error instanceof HttpErrorResponse) {
            console.error('API Error:', error);
            if(error.error.message){
              this.toast.show(error.error.message, 'error');
            }
            else{
              this.toast.show(error.message, 'error');
            }

          }
        }
      }),
      finalize(() => {
        this.loaderService.hide(); // Hide loader after request completes (success or error)
      })
    );
  }
}
