import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


const LNG_KEY= "SELECTED_LANGUAGE";
@Injectable({
  providedIn :'root'
})
export class LanguageService {
selected='';
  constructor(private translate:TranslateService) { }

  setInitialAppLanguage(){
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang('en');
    this.setLanguage("en");
  }

getLanguages(){
  return[


    { text:'English' , value :'en'},
      {text:'German' ,value :'es'},

  ];
}

  setLanguage(lng: any) {
    this.translate.use(lng);
    this.selected =lng;
    // this.storage.set(LNG_KEY,lng);
  }
}
