// src/app/services/login.service.ts
import { Injectable, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, OnInit } from '@angular/core';
import { LoginComponent } from '../../app/components/login/login.component';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private loginRef: ComponentRef<LoginComponent> | null = null;
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedInSubject.asObservable(); // use this in components

  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector, private router: Router) {
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn') || 'false');
    this.loggedInSubject.next(isLoggedIn); // initialize observable state
  }


  show() {
    if (!this.loginRef) {
      this.loginRef = createComponent(LoginComponent, { environmentInjector: this.injector });
      this.appRef.attachView(this.loginRef.hostView);
      document.body.appendChild(this.loginRef.location.nativeElement);
    }
  }

  hide() {
    if (this.loginRef) {
      this.appRef.detachView(this.loginRef.hostView);
      this.loginRef.destroy();
      this.loginRef = null;
    }
  }

  updateLoginStatus(status: boolean) {
  this.loggedInSubject.next(status);
  localStorage.setItem('loggedIn', JSON.stringify(status));
  if(!status) {
    this.router.navigate(['/']);
  }
}

}
