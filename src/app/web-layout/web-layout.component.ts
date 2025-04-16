import { Component } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-web-layout',
  imports: [MenuComponent,RouterModule],
  templateUrl: './web-layout.component.html',
  styleUrl: './web-layout.component.css'
})
export class WebLayoutComponent {

}
