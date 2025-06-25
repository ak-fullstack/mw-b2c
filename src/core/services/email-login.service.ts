import { Injectable } from '@angular/core';
import { firebaseAuth } from '../config/firebase.config'; 
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class EmailAuthService {
  currentUser: User | null = null;
  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(firebaseAuth, (user) => {
      this.currentUser = user;
      // You can emit this user state with a Subject/Observable if needed
    });
  }

  async initLoginCheck(): Promise<void> {
    if (isSignInWithEmailLink(firebaseAuth, window.location.href)) {
      let storedEmail = window.localStorage.getItem('emailForSignIn');

      if (!storedEmail) {
        storedEmail = window.prompt('Please provide your email for confirmation');
      }

      if (storedEmail) {
        try {
          const result = await signInWithEmailLink(firebaseAuth, storedEmail, window.location.href);
          console.log('Signed in as:', result.user.email);

          window.localStorage.removeItem('emailForSignIn'); // Clear stored email
          window.history.replaceState({}, document.title, window.location.pathname); // Clean URL
        } catch (error) {
          console.error('Error signing in with email link:', error);
        }
      }
    }
  }

  async sendAuth(email: string): Promise<void> {
    const actionCodeSettings = {
      url: window.location.origin + '/login',  // Your app URL where the link should redirect
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      console.log('Sign-in link sent to', email);
    } catch (error) {
      console.error('Error sending sign-in link:', error);
    }
  }
}