//import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize,YoutubeItem, VideoItem } from '@ngx-gallery/core';
// import { EmbedVideoService } from 'ngx-embed-video';
import {OnChanges, Component, OnInit, TemplateRef, Input} from '@angular/core';
import { BsModalService,BsModalRef } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-gallery-main',
  templateUrl: './gallery-main.component.html',
  styleUrls: ['./gallery-main.component.css']
})
export class GalleryMainComponent implements OnInit,OnChanges {
  modalRef:BsModalRef;
  items: GalleryItem[];
  videoId='';
  item2:any;
  item3:any;
  @Input()
  imageData = [];
  currentIndex:any=0

  constructor(public gallery: Gallery, // private embedService: EmbedVideoService
    private modalService: BsModalService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // this.getGallaryImage();
    // console.log("data:imageData ",this.imageData);

    // this.item2 =  this.imageData.forEach(element=>{
    //   if(element.mediaType== 'YOUTUBE'){
    //     console.log("image value ",element.mediaType , element.src);
    //     return element.src
    //   }
    // })

    this.item2 =this.imageData.map(item2 => { 
      if(item2.mediaType == 'YOUTUBE') {
        return item2.src
      }
    })

    this.item3=this.imageData.map(item3 => {
      if(item3.mediaType== 'VIDEO') {
        return item3.src;
      }
    })

    this.items = this.imageData.map(item => {
      if(item.mediaType == 'IMAGE'){
        return   new ImageItem({src: encodeURI(item.src), thumb: item.thumb})
      }
      else if(item.mediaType == 'YOUTUBE'){
  
        // this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(item.src);
        // return new YoutubeItem({src:   item.src, thumb: this.embedService.embed(item.src)});
        return new YoutubeItem({src: item.src, thumb: this.sanitizer.bypassSecurityTrustResourceUrl(item.thumb)});
      }
      else if(item.mediaType == 'VIDEO'){
        return new VideoItem({src: item.src, thumb: item.src})
      }
    });

    this.customGalleryConfig();
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    // this.items = this.imageData.map(item => {
    // return   new ImageItem({src: encodeURI(item.src), thumb: item.thumb})
    // });
    this.items = this.imageData.map(item => {
      if(item.mediaType == 'IMAGE'){
        return   new ImageItem({src: encodeURI(item.src), thumb: item.thumb})
      }
      else if(item.mediaType == 'YOUTUBE'){
        
        // this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(item.src);
        // return new YoutubeItem({src: item.src, thumb: this.embedService.embed(item.thumb)});
        return new YoutubeItem({src: item.src, thumb: this.sanitizer.bypassSecurityTrustResourceUrl(item.thumb)});
      }
      else if(item.mediaType == 'VIDEO'){
        return new VideoItem({src: item.src, thumb: item.src})
      }
    });
   
    this.customGalleryConfig();
  }
  customGalleryConfig() {

    const lightboxGalleryRef = this.gallery.ref('lightBox');

    lightboxGalleryRef.setConfig({
      imageSize: ImageSize.Contain,
      thumbPosition: ThumbnailsPosition.Bottom,
      dots: true
    });
    console.log("image data ->",this.items)
    lightboxGalleryRef.load(this.items);

    
  }
  onImgError(event)
  {
    console.log(event)
  }


  public openModal(template:TemplateRef<any>,id){
    this.modalRef = this.modalService.show(template,  {class: 'modal-lg martopgallery'});
    this.customGalleryConfig();
    // this.ngOnInit();
  }
  activeIndex(index){
    this.currentIndex=index
  }
  prev(index){
    console.log(index)
    if(index==0)
    {
      index=this.items.length
    }
    this.currentIndex=index-1
  }
  next(index){
    console.log(index)
    if(index==this.items.length-1){
      index=-1
    }
    this.currentIndex=index+1
    console.log(this.currentIndex)
  }
}
