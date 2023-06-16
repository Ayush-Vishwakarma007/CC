import { Component, OnInit } from '@angular/core';
import {BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder, NgForm} from "@angular/forms";
import {SpinnerService} from "../../services/spinner.service";
import {SidebarLayoutToggleService} from "../../services/sidebar-layout-toggle.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {CommunityDetailsService} from "../../services/community-details.service";

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent implements OnInit {
  reason:any=[];
  email:any;
  a:any;
  flexRadioDefault :any;




  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public spinner: SpinnerService,
    public sidebarService: SidebarLayoutToggleService,
    public router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastrService: ToastrService,
    public communityService: CommunityDetailsService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params =>
      this.email = params
    );

  }


  // showForm(form: NgForm) {
  //   //console.log("form is : ",form.value);
  //   this.a= form.value;
  //   console.log("check value: ",this.a);

  // }


myFunction(e){
  if(e=='other'){
    this.reason ='';
  }else{
    this.reason = e;
  }
 }


  submit(){
    console.log(this.reason);
    let formData={};
    formData['email']=this.email.email;
    formData['id']=this.email.id;
    formData['unsubscribeReason']=this.reason;





    if(this.reason!=''){
      let data = {
        path: "notification/notification/unsubscribe",
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
  console.log(this.reason);
  }
}
