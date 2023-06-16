import { Component, OnInit } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Item } from 'angular2-multiselect-dropdown';
import { newGalleryService  } from '../../../services/new-gallery.service';
import {SpinnerService} from '../../../services/spinner.service';
import {pagination} from "../../../pagination";
import {PipeTransform, Pipe} from "@angular/core";
// import { link } from 'fs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  items: GalleryItem[];
  imageData:any = [];
  ChapterId: any;
  CatList: any;
  sideList: any=[];
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
  sideImages = [];
  isShow = false;
  isShowDiv = false;
  eventName = '';
  nonListedEventList: any = [];
  eventId = '';
  galleryName = '';
  galleryId : any;
  reqData:any=[];
  totalPages :any= [];
  totalPages1 :any= [];
  listOfMedia:any =[];
  reqData1:any=[];
  uploadedFiles:any=[]
  
  constructor(public gallery: Gallery, private route: ActivatedRoute, public router: Router, public apiService: ApiService,public gallaryService:newGalleryService,public spinner: SpinnerService) {
    this.chapter = JSON.parse(localStorage.getItem('chapter'));
    this.ChapterId = this.chapter.id;
    localStorage.removeItem('eventUrl');
  }

  async ngOnInit() {

    this.isShowDiv = false;
    //await this.getEventTypes();
    await this.getNonlistedEvent();
    this.reqData = {
      "filter": {
        "chapterId": this.eventId,
        "galleryLocation":'GENERAL',
        "mediaLimit": 4
      },
      "page": {
        "pageLimit": 9,
        "pageNumber": 0
      }
    };
    this.reqData1 = {
      "filter": {
        // "status": "APPROVED"
      },
      "page": {
        "pageLimit": 9,
        "pageNumber": 0
      }
    };
    this.getGallerys();
  }


  // catSelect(sideCat) {
  //   this.gallaryId = sideCat;
  //   this.getMedias();
  // }

  // async topcat(cat) {
  //   this.selectedEvent = cat;
  //   this.categoryName = cat;
  //   await this.getGallerys();
  //   await this.getMedias()
  // }

  getEventTypes(){
    let request2 = {
      path: 'gallery/gallery/categories/' + this.ChapterId,
      isAuth: true,
    };
    this.spinner.show();
    return new Promise((resolve) => {
      this.apiService.get(request2).subscribe(response => {
        this.CatList = response['data']['categoryNames'];
        this.selectedEvent = this.CatList[0];
        this.spinner.hide();
        resolve(null);
      });
    });
  }

  getNonlistedEvent(){
    this.eventId =this.chapter.id
  }


  getGallerys(){
    this.isShowDiv = false;
    let request = {
      path: "gallery/galleries",
      data: this.reqData,
      isAuth: false,
    };
    this.spinner.show();
    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        this.sideList = response['data'];
        this.totalPages = pagination.arrayTwo(response['data']['totalPages'], this.reqData.page.pageNumber);
        this.spinner.hide();
        resolve(null);
      });
    });
  }
  pagination(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber - 1;
      } else if (type == 'current') {
        this.reqData.page.pageNumber = current;
      } else {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
      }
      console.log(this.reqData.page.pageNumber);
      this.getGallerys();
    }
  }

  getMedias(gallaryId, galleryName){
    this.isShow = true;
    this.isShowDiv = true;
    this.galleryName = galleryName
    this.galleryId = gallaryId
    // console.log("gallery Id",this.galleryId,gallaryId)
    this.reqData1['filter']['galleryId'] = this.galleryId;
    let request = {
      path: "/gallery/medias",
      data: this.reqData1,
      isAuth: false,
    };
    this.spinner.show();
    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        console.log("media res: ", response);
        this.listOfMedia = response['data'];
        this.centerComponent = response['data']['content'];
        this.imageData =  [];
        this.centerComponent.forEach((item, index) => {
          // console.log("image value mediaType ",item.mediaType);
          if(item.mediaType == 'YOUTUBE'){
            // console.log("image value link ",item.link);
            var videoId = item.link.split('v=')[1];
            // console.log("image value videoId ",videoId);
            this.imageData.push({ src: videoId, thumb: item.link, mediaType: item.mediaType });
            // console.log("v ",videoId)
            // console.log("Gallery Component",videoId);
            
          }else{
            // console.log("Gallery Component");
            this.imageData.push({ src: item.link, thumb: item.link, mediaType: item.mediaType });
          }
        });
        this.totalPages1 = pagination.arrayTwo(response['data']['totalPages'], this.reqData1.page.pageNumber); 
        this.spinner.hide();
        window.scroll(0,0);
        resolve(null);
      });
    });
  }

  pagination1(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {
        this.reqData1.page.pageNumber = (this.reqData1['page']['pageNumber'])-1;
      } else if (type == 'current') {
        this.reqData1.page.pageNumber = current;
      } else {
        this.reqData1.page.pageNumber = (this.reqData1['page']['pageNumber'])+1;
      }
      // console.log(this.reqData1.page.pageNumber,this.galleryId,this.galleryName);
      this.getMedias(this.galleryId,this.galleryName);
    }
  }
  back(){
    if(this.isShow){
      this.reqData.page.pageNumber =0;
      this.reqData1.page.pageNumber =0;
      this.isShow = false;
      this.isShowDiv = false;
      this.galleryName=""
    }
  }
}
