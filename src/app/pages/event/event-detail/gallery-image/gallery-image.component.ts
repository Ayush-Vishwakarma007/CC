import {Component, Input, OnInit} from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition, VideoItem, YoutubeItem} from "@ngx-gallery/core";
// import {EmbedVideoService} from "ngx-embed-video";
import { DomSanitizer, SafeResourceUrl,  }from'@angular/platform-browser'

@Component({
  selector: 'app-gallery-image',
  templateUrl: './gallery-image.component.html',
  styleUrls: ['./gallery-image.component.scss']
})
export class GalleryImageComponent implements OnInit {

  items: GalleryItem[];
  safeSrc: SafeResourceUrl;

  @Input()
  imageData = [];

  constructor(public gallery: Gallery, // private embedService: EmbedVideoService, 
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.items = this.imageData.map(item => {
      if (item.mediaType == 'IMAGE') {
        console.log(encodeURI(item.src),);
        return new ImageItem({src: encodeURI(item.src), thumb: item.thumb})
      } else if (item.mediaType == 'YOUTUBE') {
        // return new YoutubeItem({src: item.src, thumb: this.embedService.embed(item.thumb)})
        return new YoutubeItem({src: item.src, thumb: this.sanitizer.bypassSecurityTrustResourceUrl(item.thumb)})
      } else if (item.mediaType == 'VIDEO') {
        return new VideoItem({src: item.src, thumb: item.thumb})
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

    lightboxGalleryRef.load(this.items);
  }
}
