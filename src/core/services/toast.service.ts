import { ApplicationRef, ComponentRef, Injectable, Injector } from '@angular/core';
import { ToastComponent } from '../../app/components/toast/toast.component';
import { createComponent } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
    constructor(private appRef: ApplicationRef, private injector: Injector) {}

    show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 5000) {
      const toastRef: ComponentRef<ToastComponent> = createComponent(ToastComponent, {
        environmentInjector: this.appRef.injector,
      });
  
      toastRef.instance.message = message;
      toastRef.instance.type = type;
  
      this.appRef.attachView(toastRef.hostView);
      const domElem = (toastRef.hostView as any).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
  
      setTimeout(() => {
        toastRef.instance.hide(); // Trigger slide-out
        setTimeout(() => {
          this.appRef.detachView(toastRef.hostView);
          toastRef.destroy();
        }, 500); // Match transition duration
      }, duration);
    }
}
