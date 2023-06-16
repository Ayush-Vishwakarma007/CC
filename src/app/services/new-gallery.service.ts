import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})

export class newGalleryService {
  public ChapterId: any;
  public firstGallaeryId: any;
  public chapter :any;
  public selectedCat :any;
  public CatList: any;
  public selectedEvent: any ;

  constructor(private apiService:ApiService) {
    this.chapter = JSON.parse(localStorage.getItem('chapter'));
    this.ChapterId = this.chapter.id;
  }

  // init(){
  //   this.getEventCat();
  // }

  getEventCat() {
    let request2 = {
      path: 'gallery/gallery/categories/' + this.ChapterId,
      isAuth: true,
    };
    this.apiService.get(request2).subscribe(response => {
      this.CatList = response['data']['categoryNames'];
      return this.selectedEvent = this.CatList[0];
    });
  }
}
