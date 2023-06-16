import { Component, OnInit } from '@angular/core';
import {BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../services/spinner.service";
import {SidebarLayoutToggleService} from "../../services/sidebar-layout-toggle.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {CommunityDetailsService} from "../../services/community-details.service";

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  reason:any;
  email:any;
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public spinner: SpinnerService,
    public sidebarService: SidebarLayoutToggleService,
    public router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    public communityService: CommunityDetailsService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params=> {
      this.email = params['email'];
    });
  }
  submit(){
    let formData={};
    formData['email']=this.email;
    formData['subscribeReason']=this.reason;
      let data = {
        path: "notification/notification/subscribe",
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
  }

}
