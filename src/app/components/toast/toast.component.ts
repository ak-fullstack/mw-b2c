import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';

  isVisible = false;

  ngOnInit() {
    // Trigger animation
    setTimeout(() => {
      this.isVisible = true;
    }, 10);
  }

  hide() {
    this.isVisible = false;
  }

  get progressColor(): string {
    switch (this.type) {
      case 'success': return 'oklch(62.7% 0.194 149.214)';
      case 'error': return '#f44336';
      case 'info': return '#2196f3';
      default: return '#ccc';
    }
  }
}
