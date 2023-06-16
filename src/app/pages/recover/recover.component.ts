import { Component, OnInit } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {CommunityDetailsService} from "../../services/community-details.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

  email:any;
  reason:any;
  constructor( private toastrService: ToastrService,    public communityService: CommunityDetailsService,
               private activatedRoute: ActivatedRoute, public apiService: ApiService,public router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params=> {
      this.email = params['email'];
    });
  }
  submit(){
    let formData={};
    formData['email']=this.email;
    formData['deletedUserMessage']=this.reason;
    if(this.reason!=''){
      let data = {
        path: "auth/user/recover",
        data: formData,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.reason='';
          this.router.navigate(['/']);
        }
      });
    }else{
      this.toastrService.error('Please enter valid message');
    }
  }


}
