import {
  Injectable,
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector
} from '@angular/core';
import { LoaderComponent } from '../../app/components/loader/loader.component'; // adjust path as needed

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loaderRef: ComponentRef<LoaderComponent> | null = null;
  private showTimestamp = 0;
  private hideTimeout: any;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  show() {
    if (this.loaderRef) return;

    this.loaderRef = createComponent(LoaderComponent, {
      environmentInjector: this.injector
    });

    this.appRef.attachView(this.loaderRef.hostView);
    document.body.appendChild(this.loaderRef.location.nativeElement);

    // trigger fade-in
    setTimeout(() => {
      if (this.loaderRef?.instance) {
        this.loaderRef.instance.visible = true;
      }
    });

    this.showTimestamp = Date.now();
  }

  hide() {
    if (!this.loaderRef) return;

    clearTimeout(this.hideTimeout);

    const elapsed = Date.now() - this.showTimestamp;
    const remaining = Math.max(2000 - elapsed, 0); // wait at least 2s

    this.hideTimeout = setTimeout(() => {
      if (!this.loaderRef) return;

      this.loaderRef.instance.visible = false;

      // wait for fade-out (300ms) before removing
      setTimeout(() => {
        if (!this.loaderRef) return;

        this.appRef.detachView(this.loaderRef.hostView);
        this.loaderRef.destroy();
        this.loaderRef = null;
      }, 200);
    }, remaining);
  }
}
