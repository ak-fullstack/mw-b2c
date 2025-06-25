import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profile:any;
  constructor(private apiService:ApiService){

  }
  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(){
    this.apiService.getMyProfile().subscribe({
      next:(res)=>{
        this.profile=res;
      }
    })
  }


}
