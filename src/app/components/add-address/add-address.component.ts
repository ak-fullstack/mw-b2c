import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-add-address',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css'
})
export class AddAddressComponent implements OnInit {
  

  states: any[] = [];
   addressForm = new FormGroup({
    streetAddress: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('Tamil Nadu', [Validators.required]),  // Enum, you can add custom validator if needed
    pincode: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern('^[0-9]{6}$'),  // Assuming pincode is 6 digit numeric
    ]),
  });


  constructor(private readonly apiService:ApiService){
  }
  ngOnInit(): void {
    this.getAllStates();
  }



  getAllStates() {
    this.apiService.getAllStates().subscribe({
      next: (res: any) => {
        this.states = res;
      },
      error: (error: any) => {
        console.error('Error fetching states:', error);
      }
    });
  }

  onSubmit(){
    if(this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    const payload = this.addressForm.value; 
    payload.pincode = payload.pincode?.toString();
    this.apiService.addCustomerAddress(payload).subscribe({
      next: (res: any) => {
        this.close();
      },
      error: (error: any) => {
        console.error('Error adding address:', error);
      }
        // Handle error appropriately, maybe show a message to the user
    });
     
  }

    get control() {
    return this.addressForm.controls;
  }


    @Output() closeAddAddressEvent = new EventEmitter<void>();

  close() {
    this.closeAddAddressEvent.emit();
  }
  
}
