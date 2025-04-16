import { Component } from '@angular/core';
import { LoginService } from '../../../core/services/login.service'; 

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(private loginService: LoginService) {
    
  }
  login() {
    this.loginService.show();
  }
}
