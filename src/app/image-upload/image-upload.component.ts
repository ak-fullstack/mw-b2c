import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule,ImageCropperComponent],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css'
})
export class ImageUploadComponent {
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  imageChangedEvent: Event | null = null;
  showCropper = false;
  croppedImageBlob: Blob | null = null;
  @Input() context: any; // e.g. variantId, userId, productId, etc.
  @Output() imageCroppedFile = new EventEmitter<any>();


  constructor() { }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onImageChange(event: Event) {
    this.imageChangedEvent = event;
    this.showCropper = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageBlob = event.blob ?? null;

  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  cropSubmit() {

    if (this.croppedImageBlob) {
      const originalFileName = (this.imageChangedEvent?.target as HTMLInputElement)?.files?.[0]?.name;

      if (originalFileName) {
        const file = new File([this.croppedImageBlob], originalFileName, { type: 'image/jpeg' });
        this.imageCroppedFile.emit({ file, context: this.context });
        this.imageChangedEvent = null;
        this.showCropper = false;
      } else {
        console.error('Original file name is missing!');
      }
    } else {
      console.error('Cropped image is missing!');
    }
  }
}
