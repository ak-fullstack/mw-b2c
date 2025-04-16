import { Injectable, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { LoaderComponent } from '../../app/components/loader/loader.component'; 

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loaderRef: ComponentRef<LoaderComponent> | null = null;

  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) {}

  show() {
    if (!this.loaderRef) {
      this.loaderRef = createComponent(LoaderComponent, { environmentInjector: this.injector });
      this.appRef.attachView(this.loaderRef.hostView);
      document.body.appendChild(this.loaderRef.location.nativeElement);
    }
  }

  hide() {
    if (this.loaderRef) {
      this.appRef.detachView(this.loaderRef.hostView);
      this.loaderRef.destroy();
      this.loaderRef = null;
    }
  }
}
