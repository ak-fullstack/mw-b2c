import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUploadComponent } from '../../../image-upload/image-upload.component';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,ImageUploadComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  myOrders:any[]=[];
  showDetails = false;
  selectedOrder: any;
  returnItems:any=null;
  returnImages:any=[];

  constructor(private apiService:ApiService){
    
  }
  ngOnInit(): void {
    this.getCustomerOrders();
  }

  getCustomerOrders(){
    this.apiService.getCustomerOrders().subscribe({
      next:(res)=>{
        this.myOrders=res;
      }
    })
  }

   viewOrder(order: number) {
    this.selectedOrder = order;
    this.showDetails = true;
  }

  backToList() {
    this.selectedOrder = null;
    this.showDetails = false;
  }

  getStatusClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800';
    case 'QC_CHECK':
      return 'bg-indigo-100 text-indigo-800';
    case 'WAITING_PICKUP':
      return 'bg-orange-100 text-orange-800';
    case 'SHIPPED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'RETURNED':
    case 'PARTIALLY_RETURNED':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-200 text-gray-700';
  }
}

increaseQuantity(index: number) {
  
  if (this.returnItems.items[index].quantity < this.selectedOrder.items[index].quantity) {
    this.returnItems.items[index].quantity++;
  }
}

decreaseQuantity(index: number) {
  if (this.returnItems.items[index].quantity > 1) {

    this.returnItems.items[index].quantity--;
  }
}

removeItem(index: number) {
  this.returnItems.items.splice(index, 1);
}

openReturnRequest(){
      this.returnItems = structuredClone(this.selectedOrder);
}

createReturnRequest(){
  const payload = {
  orderId: this.returnItems.orderId,
  reason: 'replacement',
  items: this.returnItems.items.map((item:any) => ({
    orderItemId: item.orderItemId,
    quantity: item.quantity,
    reason: item.reason
  })),
  images:this.returnImages
};

this.apiService.createReturnRequest(payload).subscribe({
  next:(res:any)=>{
      this.backToList();
  }
})

  
}

  handleImageUpload({file}: { file: File, context: any }) {

    const formData = new FormData();
    formData.append('file', file, file.name);
        this.apiService.uploadReturnImage(formData).subscribe(
      (res:any) => {
        this.returnImages.push(res.url)
        
      },
      (err:any) => {
        console.error('Upload failed', err);
      }
    );
  }


    downloadOrderInvoice() {
    const payload={orderId:this.selectedOrder.id}
    this.apiService.downloadOrderInvoice(payload).subscribe({
      next: (res: HttpResponse<Blob>) => {
        const blob = new Blob([res.body!], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'order-report.pdf';
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: () => { }
    })
  }

}
