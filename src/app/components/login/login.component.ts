import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { LoginService } from '../../../core/services/login.service';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';

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
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)])
  });



  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const reenterPassword = control.get('reenterPassword')?.value;

    return newPassword === reenterPassword ? null : { passwordMismatch: true };
  }

  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    otp: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
  });

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    otp: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)])
  });

  newPasswordForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    ]),
    reenterPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)])
  }, { validators: this.passwordMatchValidator });

  signIn = true;
  resetPassword = false;
  register = false;
  otpVerified = false;

  showOtpInput = false;


  constructor(private fb: FormBuilder, private loginService: LoginService, private apiService: ApiService, private router: Router) {
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
      this.renderGoogleSignIn();
    }).catch(err => {
      console.error("Google API script failed to load", err);
    });
  }


  setValue(target: 'a' | 'b' | 'c') {
    this.signIn = target === 'a' || false;
    this.register = target === 'b' || false;
    this.resetPassword = target === 'c' || false;

    this.registerForm.reset();
    this.resetForm.reset();
    this.loginForm.reset();
    this.otpVerified = false;
    this.newPasswordForm.reset();

    if (target === 'a') {
      setTimeout(() => {
        this.renderGoogleSignIn();
      }, 1);
    }

  }


  renderGoogleSignIn() {
    google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large' }
    );
  }


  sendOtpForRegistration() {
    const payload = {
      email: this.registerForm.get('email')?.value,
    };
    this.apiService.sendCustomerEmailOtp(payload).subscribe({
      next: (res) => {
        this.showOtpInput = true;
      }
    })
  }

  sendOtpForReset() {
    const payload = {
      email: this.resetForm.get('email')?.value,
    };
    this.apiService.sendResetOtp(payload).subscribe({
      next: (res) => {
        this.showOtpInput = true;
      }
    })
  }


  verifyResetOtp() {
    if (this.resetForm.invalid) {
      return;
    }
    const payload = {
      email: this.resetForm.get('email')?.value,
      otp: this.resetForm.get('otp')?.value,
      purpose: 'update-customer'
    };

    this.apiService.verifyCustomerEmailOtp(payload).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        this.otpVerified = true;
      }
    })
  }

  verifyRegisterOtp() {
    if (this.registerForm.invalid) {
      return;
    }
    const payload = {
      email: this.registerForm.get('email')?.value,
      otp: this.registerForm.get('otp')?.value,
      purpose: 'register'
    };

    this.apiService.verifyCustomerEmailOtp(payload).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        this.otpVerified = true;
      }
    })
  }

  changePassword() {
    const payload = {
      password: this.newPasswordForm.get('newPassword')?.value
    }
    this.apiService.updateCustomer(payload).subscribe({
      next: () => {
        this.setValue('a');
      }
    })
  }

  createCustomer() {
    const payload = {
      password: this.newPasswordForm.get('newPassword')?.value
    }
    this.apiService.createCustomer(payload).subscribe({
      next: () => {
        this.setValue('a');
      }
    })

  }

  verifyPassword() {
    if (this.loginForm.invalid) {
      return;
    }
    const payload = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };
    this.apiService.customerLogin(payload).subscribe({
      next: (res) => {
        this.redirectAferLogin();
      }
    })
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
    const payload = {
      token: idToken
    }
    this.apiService.verifyOauthToken(payload).subscribe({
      next: (res) => {
        this.redirectAferLogin();
      }
    })
  }

  redirectAferLogin() {
    const currentUrl = this.router.url;
    this.loginService.hide();
    this.loginService.updateLoginStatus(true);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  closeLogin(){
    this.router.navigate(['/']);
    this.loginService.hide();
  }
}
