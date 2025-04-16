import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { LoginService } from '../../../core/services/login.service';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';

declare var google: any;


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    otp: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)])
  });

  private googleAuth: any;


  showOtpInput = false;


  constructor(private fb: FormBuilder, private loginService: LoginService,private apiService:ApiService) {
  }

  ngOnInit(): void {
    this.loginForm.get('email')?.valueChanges.subscribe(value => {
      this.showOtpInput = false;
    });

    this.loadGoogleScript().then(() => {
      // Initialize the Google Identity Services API
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleCredentialResponse(response),
      });

      // Render the Google Sign-In button
      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large' }
      );
    }).catch(err => {
      console.error("Google API script failed to load", err);
    });
  }
  

  sendOtp(){
 
    const payload = {
      email: this.loginForm.get('email')?.value,
    };
    this.showOtpInput=true;

    // this.apiService.sendOtp(payload).subscribe({
    //   next: (res) => {
    //     this.showOtpInput=true;
    //   }
    // })
}

  verifyOtp() {
    if(this.loginForm.invalid){
      return;
    }
    const payload = {
      email: this.loginForm.get('email')?.value,
      otp: this.loginForm.get('otp')?.value
    };
    // this.apiService.verifyOtp(payload).subscribe({
    //   next: (res) => {
    //     localStorage.setItem('token', res.access_token);
    //     localStorage.setItem('role', res.role.roleName);
    //     this.router.navigate(['']); 
    //   }
    // })
  }
  close() {
    this.loginService.hide(); 
  }

  

  loadGoogleScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.accounts) {
        resolve(true);
      } else {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(true);
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      }
    });
  }

  handleCredentialResponse(response: any) {
    // This function will handle the response from Google (ID Token)
    const idToken = response.credential;
    console.log('ID Token:', idToken);
    this.sendGoogleTokenToBackend(idToken);
  }

  sendGoogleTokenToBackend(idToken: string) {
    const payload={
      token:idToken
    }
      this.apiService.verifyOauthToken(payload).subscribe({
        next:(res)=>{
          const { access_token, role } = res;

          localStorage.setItem('customer_token', access_token);
          localStorage.setItem('customer-role', role);
          alert('all-done')
        }
      })
  }
}
