// import { TestBed, inject, fakeAsync, tick, async } from '@angular/core/testing';
// import { ApiService } from './api.service';
// import { HttpClient} from '@angular/common/http';
// import { HttpClientTestingModule,HttpTestingController} from '@angular/common/http/testing';
// import {LoginRegisterComponent} from'../pages/auth/login-register/login-register.component'
// import { of } from 'rxjs';
// import { delay } from 'rxjs/operators';
// import { configuration } from '../configration';
// let request = {
//   path: "auth/membershipType/getAll",
//   isAuth: true,
// };
// fdescribe('api service', () => {
 
//  let httpClient:HttpClient;
//  let httpTestCtrl:HttpTestingController;
//  let dataService:ApiService;
//  beforeEach(()=>TestBed.configureTestingModule({
//    imports:[HttpClientTestingModule],
//    providers:[{provide:ApiService,useValue:ApiService}]
//  }));
//   beforeEach(()=>{
//   dataService=TestBed.get(ApiService)
//   httpTestCtrl=TestBed.get(HttpClientTestingModule)
// })  
// it('should test http client .get',async() => {

//     const postItem = [
//       {
        
//         "id": 1,
//         "name": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
       
//       },
//       {
       
//         "id": 2,
//         "name": "qui est esse"
      
//       },
//       {
       
//         "id": 3,
//         "name": "ea molestias quasi exercitationem repellat qui ipsa sit aut"
       
//       }
//     ];
    
   
//     dataService.get(request).subscribe((posts)=>{
//       expect(postItem).toBe(posts,'should check')
//     });
//     const req=httpTestCtrl.expectOne(configuration.BASE_URL + 'posts')
//   expect(req.cancelled).toBeFalsy;
//   expect(req.request.responseType).toEqual('json')
//   })


// });
import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InjectionToken } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ngx-loading-spinner'; 
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';
import {ToastrService} from 'ngx-toastr';

export const BASE_URL = new InjectionToken<string>('BASE_URL');



describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterModule.forRoot([]),
      
       
    ],
    providers: [
      { provide: 'BASE_URL', useValue: 'https://staging-api.spcsusa.org/'},
      ApiService,
      HttpClient,
      Ng4LoadingSpinnerService
    ]
  }));


});
