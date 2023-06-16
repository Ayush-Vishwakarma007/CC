import { Component,  OnInit, Input, OnChanges } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';

@Component({
  selector: 'app-gallery-new',
  templateUrl: './gallery-new.component.html',
  styleUrls: ['./gallery-new.component.scss']
})
export class GalleryNewComponent implements OnInit,OnChanges {
  items: GalleryItem[];
  imageData = [{src:'assets/images/hei.png',thumb:'assets/images/hei.png'},{src:'assets/images/img.png',thumb:'assets/images/img.png'},{src:'assets/images/img.png',thumb:'assets/images/img.png'},{src:'assets/images/img.png',thumb:'assets/images/img.png'},{src:'assets/images/img.png',thumb:'assets/images/img.png'},{src:'assets/images/img.png',thumb:'assets/images/img.png'},{src:'assets/images/img.png',thumb:'assets/images/img.png'},{src:'assets/images/img.png',thumb:'assets/images/img.png'},{src:'assets/images/img.png',thumb:'assets/images/img.png'},{src:'assets/images/img.png',thumb:'assets/images/img.png'}];
  constructor( public gallery: Gallery) { }
  // ngOnInit() {
  // }
  ngOnInit(): void {
    // this.getGallaryImage();
 console.log(this.imageData);
     this.items = this.imageData.map(item =>
       new ImageItem({ src: encodeURI(item.src), thumb:encodeURI(item.thumb) })
     );
     console.log(this.items);

     this.customGalleryConfig();
   }
   ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.items = this.imageData.map(item =>
      new ImageItem({ src: encodeURI(item.src), thumb:encodeURI(item.thumb) })
    );
    this.customGalleryConfig();
  }
  customGalleryConfig() {

    const lightboxGalleryRef = this.gallery.ref('lightBox');

    lightboxGalleryRef.setConfig({
      imageSize: ImageSize.Contain,
      thumbPosition: ThumbnailsPosition.Bottom,
      dots: true
    });

    lightboxGalleryRef.load(this.items);
  }
}
