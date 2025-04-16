// src/app/services/login.service.ts
import { Injectable, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { LoginComponent } from '../../app/components/login/login.component'; 

@Injectable({ providedIn: 'root' })
export class LoginService {
  private loginRef: ComponentRef<LoginComponent> | null = null;

  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) {}

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
}
