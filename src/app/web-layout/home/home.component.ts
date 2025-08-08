import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  myProducts: any[] = [];
  groupedProducts: any[] = [];
  selectedColorIndex: number = 0;
  selectedSizeIndex: number = 0;
    constructor(private apiService: ApiService,private cartService :CartService) { }
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
    const sp=stock.sp;
    

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
      stockId,
      sp
    });
  }

  this.groupedProducts=grouped;
  console.log(this.groupedProducts);

     this.groupedProducts.forEach((item) => {
    item.currentIndex = 0;
    this.startAutoScroll();
  });
  
  
}

addToCart(selectedItem: any) {
  selectedItem.addedToCart=true;
  const {stockId} = selectedItem;
    this.cartService.addToCart({stockId,quantity:1});
  }

  removeFromCart(selectedItem: any) {
    selectedItem.addedToCart=false;
    const {stockId} = selectedItem;
    this.cartService.removeFromCart({stockId,quantity:1});
  }

   checkColorOutofStock(color: any): boolean {
  // Check if every size is unavailable (available < 1)
  const outOfStock = color.sizes.every((size: any) => size.available < 1);
  return outOfStock;
}

  currentIndex = 0;
  autoScrollInterval: any;
  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      const totalImages = this.getImageCount();
      
      this.currentIndex = (this.currentIndex + 1) % totalImages;
      this.goToSlide(this.groupedProducts[0],this.currentIndex);
    }, 3000); // Change image every 3 seconds
  }

  getImageCount(): number {
    // Replace this with your actual logic to count images
    const item = this.groupedProducts[0]; // Example: first product
    const images = item.colors[item.selectedColorIndex]?.sizes[item.selectedSizeIndex]?.images || [];
    return images.length;
  }

goToSlide(item: any, index: number) {
  item.currentIndex = index;
}

  ngOnDestroy() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }
 

}
