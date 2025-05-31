import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  myProducts: any[] = [];
  groupedProducts: any[] = [];
  selectedColorIndex: number = 0;
  selectedSizeIndex: number = 0;
    constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    this.getLatestStockPerProduct();
  }

  getLatestStockPerProduct() {
       this.apiService.getLatestStockPerProduct().subscribe({
      next: (res:any) => {
        this.myProducts = res;
        this.groupStockByProduct(this.myProducts);
      },
      error: (error:any) => {
        console.error('Error fetching latest stock per product:', error);
      }
    })
  }

groupStockByProduct(stockList: any[]) {
  const grouped: any[] = [];

  for (const stock of stockList) {
    const { product, color, size, sku, id: variantId, images = [] } = stock.productVariant;
    const productId = product.id;
    const available = stock.available;
    const stockId = stock.id;
    

    // Find or create product group
    let productGroup = grouped.find(p => p.product.id === productId);
    if (!productGroup) {
      productGroup = {
        product: { ...product },
        colors: [],
        selectedColorIndex:0,
        selectedSizeIndex:0
      };
      grouped.push(productGroup);
    }

    // Find or create color group
    let colorGroup = productGroup.colors.find((c:any) => {
      if (c.id === null && color === null) return true;
      return c.id === color?.id;
    });

    if (!colorGroup) {
      colorGroup = {
        id: color?.id ?? null,
        name: color?.name ?? null,
        hexCode: color?.hexCode ?? null,
        available: 0,
        sizes: [],
      };
      productGroup.colors.push(colorGroup);
    }

    colorGroup.available += available;

    // Add size entry under color group
    colorGroup.sizes.push({
      id: size?.id ?? null,
      label: size?.label ?? null,
      available,
      sku,
      variantId,
      images,
      stockId
    });
  }

  this.groupedProducts=grouped;
  console.log(this.groupedProducts);
  
  
}
}
