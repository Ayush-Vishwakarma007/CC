import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})

export class galleryService {

  public ChapterId: any;
  public firstGallaeryId: any;
  public chapter :any;
  public selectedCat :any;

  public CatList: any;
  public selectedEvent1: any ;

  constructor(private apiService:ApiService,) {
    this.chapter = JSON.parse(localStorage.getItem('chapter'));
    this.ChapterId = this.chapter.id;
    let request2 = {
      path: 'gallery/gallery/categories/' + this.ChapterId,
      isAuth: true,
    };
    this.apiService.get(request2).subscribe(response => {
      this.firstGallaeryId = response['data']['categoryNames'][0];
    });

    let request3 = {
      path: 'gallery/gallery/categories/' + this.ChapterId,
      isAuth: true,
    };
    this.apiService.get(request3).subscribe(response => {
      this.CatList = response['data']['categoryNames'];
      this.selectedEvent1 = this.CatList[0];
    });
  }

  init(){
    this.galleryCatData();
  }

  galleryCatData(){
    // let request2 = {
    //   path: 'gallery/gallery/categories/' + this.ChapterId,
    //   isAuth: true,
    // };
    // this.apiService.get(request2).subscribe(response => {
    //   this.firstGallaeryId = response['data']['categoryNames'][0];
    //   console.log(this.firstGallaeryId);
    // });
  }

  getOnloadGallery(){
    let data = {
      "filter": {
        "categoryName": this.selectedCat,
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
  }
}
