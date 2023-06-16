import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-payment-configuration',
  templateUrl: './payment-configuration.component.html',
  styleUrls: ['./payment-configuration.component.scss']
})
export class PaymentConfigurationComponent implements OnInit {
  chapterList: any = [];
  chapterDetail: any = [];
  paymentDetail: any = [];
  configList: any = [];
  chapterId = '';
  contactSupportForPayment = '';
  communityConfig: any = []

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {


  }

  async ngOnInit() {
    await this.getChapterList();
    this.getConfigList();
    this.getCommunityConfig();
  }

  getChapterList() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data'];
        if (this.chapterList[0]) {
          this.getChapterDetail(this.chapterList[0]['id']);
        }
        resolve(null);
      });
    });
  }

  getCommunityConfig() {
    let request = {
      path: 'community/configuration/get',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.communityConfig = response['data'];
      }

    });
  }

  getConfigList() {
    let request = {
      path: 'community/configuration/publicInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.configList = response['data'];
      this.contactSupportForPayment = this.configList['contactSupportForPayment'];
    });
  }

  getChapterDetail(id) {
    this.chapterId = id;
    let request = {
      path: 'community/paymentConfig/getAll/' + id,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.paymentDetail = response['data'];
    });
  }

  submit() {
    let data = {};
    data['paymentConfigurations'] = [];

    this.paymentDetail.map((item, index) => {
      let field = {};
      item['fields'].map((fields, i) => {
        field[fields['fieldName']] = fields['value'];
      });
      data['paymentConfigurations'].push({
        'enable': item['enable'],
        'type': item['type'],
        'fields': field
      })

    });
    let request = {
      path: 'community/chapter/paymentConfig/' + this.chapterId,
      data: data,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {

        let data1 = {
          'contactSupportForPayment': this.contactSupportForPayment
        }
        this.toastrService.success(response['status']['description']);
        let request = {
          path: 'community/configuration/update',
          data: data1,
          isAuth: true,
        };
        this.apiService.post(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            this.getChapterDetail(this.chapterId);
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
        this.getChapterDetail(this.chapterId);
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });

  }

  onChange(event, i) {
    this.paymentDetail.map((item, index) => {
      // if (index != i) {
      //   item.enable = false;
      // }
    });
  }
}


