import { Component, OnInit, OnChanges } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Item } from 'angular2-multiselect-dropdown';
import { galleryService  } from '../../../services/gallery.service';
import {SpinnerService} from '../../../services/spinner.service';

@Component({
  selector: 'app-gallery-inner',
  templateUrl: './gallery-inner.component.html',
  styleUrls: ['./gallery-inner.component.css']
})
export class GalleryInnerComponent implements OnInit {

  items: GalleryItem[];
  imageData = [];
  // imageData = [
  //   { src: 'assets/images/gallery/gallery-1.jpg', thumb: 'assets/images/gallery/gallery-1.jpg' },
  //   { src: 'assets/images/gallery/gallery-2.jpg', thumb: 'assets/images/gallery/gallery-2.jpg' },
  //   { src: 'assets/images/gallery/gallery-3.jpg', thumb: 'assets/images/gallery/gallery-3.jpg' },
  //   { src: 'assets/images/gallery/gallery-4.jpg', thumb: 'assets/images/gallery/gallery-4.jpg' },
  //   { src: 'assets/images/gallery/gallery-5.jpg', thumb: 'assets/images/gallery/gallery-5.jpg' },
  //   { src: 'assets/images/gallery/gallery-6.jpg', thumb: 'assets/images/gallery/gallery-6.jpg' },
  //   { src: 'assets/images/gallery/gallery-7.jpg', thumb: 'assets/images/gallery/gallery-7.jpg' },
  //   { src: 'assets/images/gallery/gallery-8.jpg', thumb: 'assets/images/gallery/gallery-8.jpg' },
  //   { src: 'assets/images/gallery/gallery-9.jpg', thumb: 'assets/images/gallery/gallery-9.jpg' },
  // ];

  ChapterId: any;
  CatList: any;
  sideList: any;
  centerComponent: any;

  selectedCat: any ;
  selectedEvent: any ;
  chapter :any;
  categoryName: any;
  gallaryId :any;
  galladyData:any;
  sum = 10;
  start = 0;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  constructor(public gallery: Gallery, private route: ActivatedRoute, public router: Router, public apiService: ApiService,public gallaryService:galleryService,public spinner: SpinnerService) {

    this.route.params.subscribe(params =>{
      this.chapter = JSON.parse(localStorage.getItem('chapter'));
      this.ChapterId = this.chapter.id;
    });
  }


  ngOnInit(): void {
    //this.spinner.show();
    this.getEventCat();
    this.getAllGallaryWithFilter();
    this.centerGalaryContaint();
    this.customGalleryConfig();

  }

  catSelect(sideCat) {
    this.selectedEvent = sideCat;
    this.centerGalaryContaint();
  }

  topcat(cat) {
    this.selectedCat = cat;
    this.categoryName = cat;
    this.getAllGallaryWithFilter();
  }

  getEventCat() {
    let request2 = {
      path: 'gallery/gallery/categories/' + this.ChapterId,
      isAuth: true,
    };
    this.apiService.get(request2).subscribe(response => {
      this.CatList = response['data']['categoryNames'];
      this.selectedEvent = this.CatList[0];
    });
  }

  centerGalaryContaint() {
    setTimeout(()=>{
      this.gallaryService.init();
      this.selectedEvent =this.gallaryService.firstGallaeryId ;
    },600);
      let data = {
        "filter": {
          "galleryId": this.selectedEvent,
          "status": "APPROVED"
        },
        "page": {
          "pageLimit": 10,
          "pageNumber": 0
        }
      };

      let request = {
        path: "/gallery/medias",
        data: data,
        isAuth: false,
      };

      this.apiService.post(request).subscribe(response => {
        this.centerComponent = response['data']['content'];
        this.imageData =  [];
        this.centerComponent.forEach((item, index) => {
            this.imageData.push({ src: item.link, thumb: item.link });
        });
      });

  }

  getAllGallaryWithFilter() {
    this.spinner.show();
    let data = {
      "filter": {
        "categoryName": this.selectedEvent,
        "chapterId": this.ChapterId,
        "mediaLimit": 1
      },
      "page": {
        "pageLimit": 100,
        "pageNumber": 0
      }
    };

    let request = {
      path: "gallery/galleries",
      data: data,
      isAuth: false,
    };

    this.apiService.post(request).subscribe(response => {
      this.sideList = response['data']['content'];
      this.gallaryId = this.sideList[0].id;
      let data_media = {
        "filter": {
          "galleryId": this.gallaryId,
          "status": "APPROVED"
        },
        "page": {
          "pageLimit": this.sum,
          "pageNumber": this.start
        }
      };

      let request_media = {
        path: "gallery/medias",
        data: data_media,
        isAuth: false,
      };

      this.apiService.post(request_media).subscribe(response => {

        this.spinner.hide();
        this.centerComponent = response['data']['content'];
        this.imageData =  [];
        this.centerComponent.forEach((item, index) => {
            this.imageData.push({ src: item.link, thumb: item.link });
        });
      });

      this.sideList.forEach((item, index) => {

        if(index == 0){ this.selectedEvent = item.id; }

        if (item.mediaList) {
          item.mediaList.forEach((item1, index1) => {
            if (index1 == 0) {
              this.sideList[index].media = item1.link;
            }
          });
        }
        if (item.mediaList.length == 0) {
         // this.sideList[index].media = 'assets/images/background.png';
        }
      });

    });
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

  onScrollDown (ev) {
    const start = this.sum;
    this.sum += 20;
    this.getAllGallaryWithFilter();
    this.direction = 'down'
  }
}
