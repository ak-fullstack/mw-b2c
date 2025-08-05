import { Component } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-web-layout',
  imports: [MenuComponent,RouterModule,FooterComponent],
  templateUrl: './web-layout.component.html',
  styleUrl: './web-layout.component.css'
})
export class WebLayoutComponent {

}
