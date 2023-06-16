import { Component, OnInit } from '@angular/core';
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { SeoService } from "../../../services/seo.service";
import { Subject } from "rxjs";
import { configuration } from "../../../configration";
// import { initDomAdapter } from '@angular/platform-browser/src/browser';


@Component({
  selector: 'app-participate-checkout',
  templateUrl: './participate-checkout.component.html',
  styleUrls: ['./participate-checkout.component.scss']
})
export class ParticipateCheckoutComponent implements OnInit {

  submitSubject: Subject<any> = new Subject();

  authDetail: any = [];
  eventId = '';
  eventDetail: any = [];
  guestShow: boolean = false;
  participantDetail: any = [];
  mediaList:any=[]
  choreographerDetail: any;
  paymentDetail: any = []
  businessInfo: any = [];

  reqData:any={}
  constructor(public spinner: SpinnerService, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.route.params.subscribe(params =>
      this.eventId = params['id']
    );
    this.paymentDetail['finalAmount'] = 0;
    localStorage.removeItem('eventUrl');
  }

  async ngOnInit() {
    document.querySelector("body").removeAttribute('class');
    await this.getEventDetail();
    if (!this.authDetail) {
      this.guestShow = true;
    }
  }
  getEventDetail() {
    this.spinner.show();
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
          console.log(this.eventDetail);
        } else {
          this.toastrService.error(response['status']['description']);
        }
        resolve(null);
        this.spinner.hide();
      });
    });
  }

  addParticipant() {
    console.log(this.participantDetail)
    if (this.participantDetail) {
      this.guestShow = false;
      console.log(this.participantDetail);
    }
  }

  paymentStep() {
    this.submitSubject.next(null);
  }

  paymentCheckout() {
    if (this.choreographerDetail != null) {
      let tempArr = {
        "eventId": this.eventId,
        "eventPerformance": {
          "contactFirstName": this.choreographerDetail['firstName'],
          "contactLastName": this.choreographerDetail['lastName'],
          "description": this.choreographerDetail['description'],
          "email": this.choreographerDetail['email'],
          "name": this.choreographerDetail['performanceName'],
          "phone": this.choreographerDetail['phone'],
          "contactBusinessName": this.choreographerDetail['contactChoreographerBusinessName'],
        },
        "performanceDuration": this.choreographerDetail['duration'],
      };
      console.log(tempArr)
      if (this.businessInfo.length != 0) {
        tempArr['businessInfo'] = this.businessInfo
      }else{
        tempArr['businessInfo'] = {}
      }

      let participantArr = [];
      this.participantDetail.forEach(item => {
        console.log(item)
        participantArr.push({
          "age": item.age,
          "email": item.email,
          "firstName": item.firstName,
          "lastName": item.lastName
        })
      });

      tempArr['participants'] = participantArr;
      console.log(tempArr['participants'])
      //console.log(tempArr);
      tempArr['paymentMethodUsed']="CASH"
      tempArr['mediaFiles']=this.mediaList
      let data = {
        path: "event/participation",
        data: tempArr,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED') {
          this.toastrService.success(response['status']['description']);
          localStorage.setItem('eventId', this.eventId);
          this.router.navigate(['/payment/event/payment-success']);
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    else {
      this.toastrService.error("Enter Choreographer Details")
    }
  }

}
