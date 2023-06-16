import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-membership-number',
  templateUrl: './membership-number.component.html',
  styleUrls: ['./membership-number.component.scss']
})
export class MembershipNumberComponent implements OnInit {
  generationMethodList: any = [];
  generationTypeList: any = [];
  membershipList: any = [];
  durationList: any = [];
  typeId="";
  membershipDetail: any = [];
  planId="";
  fieldList: any[] = [{generationType: '', value: '',length :0}];
  samplePreview : any;
  separators :any = [];
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

  }

  async ngOnInit() {
    this.getDurationsType();
    window.scroll(0,0);
    await this.getMembershipList();
    await this.getNumberSeparators();
    await this.getNumberGenerationMethod();
    await this.getNumberGenerationType();


  }

  getNumberGenerationMethod() {
    let request = {
      path: 'auth/numberGenerationMethod',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.generationMethodList = response['data'];
    });
  }

  getNumberGenerationType() {
    let request = {
      path: 'auth/numberGenerationType',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.generationTypeList = response['data'];
      console.log("generationlist",this.generationTypeList)
    });
  }
  getNumberSeparators() {
    let request = {
      path: 'auth/configuration/formatSeparators',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.separators = response['data'];
    });
  }
  getMembershipList() {
    let request = {
      path: 'auth/membershipType/getAll',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.membershipList = response['data'];

        this.membershipList.forEach((item, index) => {
          item['plans'].forEach(p => {
            let duration = this.durationList.filter(i => p.durationType == i.value);
            if(duration)
            {
              p['durationName'] = duration[0]['name'];
            }
          });
        });
        resolve(null);
        console.log("membershplst",this.membershipList)
      });
    });
  }
  getDurationsType() {
    let request = {
      path: 'auth/durationType',
      isAuth: true,
    };
      this.apiService.get(request).subscribe(response => {
        this.durationList = response['data'];
    });
  }
  addDynamicField() {
    this.fieldList.push({generationType: '', value: '',length :0});
  }
  removeField(i) {
    this.fieldList.splice(i, 1);
  }
  submit()
  {
    let fieldList = this.fieldList.filter(item => item.generationType !== '' && item.value !== '');
    let data = {
      'numberFormatGenerators':fieldList,
      "planId" : this.planId
    };
    if(this.typeId == '')
    {
      this.toastrService.error('Select vaild membership type ');
    }else if(this.planId == '')
    {
      this.toastrService.error('Select vaild plan type ');
    }
    else {
      let request = {
        path: 'auth/membershipType/numberFormat/'+this.typeId,
        data : data,
        isAuth: true,
      };
      this.apiService.post(request).subscribe(response => {
        if (response['status']['code'] == 'OK')
        {
          this.toastrService.success(response['status']['description']);
        }else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  setTypeId(id)
  {
    this.samplePreview = '';
    this.fieldList = [{generationType: '', value: '',length :0}];

    let data = this.membershipList.filter(item => item.id == id)[0];
    this.membershipDetail = [];
    if(data)
    {
      this.membershipDetail = data;
    }
   this.setPlanId(this.planId);
  }
  setPlanId(id)
  {
    this.samplePreview = '';

    let data = this.membershipDetail['plans'].filter(item => item.id == id)[0];
    this.fieldList = [{generationType: '', value: '',length :0}];

    if(data)
    {
      if(data['numberFormatGenerators'] && data['numberFormatGenerators'].length != 0)
      {
        this.fieldList = data['numberFormatGenerators'];
      }
      this.getPreviewAll();
    }
    console.log(this.membershipDetail)
  }
  getPreviewAll()
  {
    let fieldList = this.fieldList.filter(item => item.generationType !== '' && item.value !== '');
    let data = {
      'numberFormatGenerators':fieldList,
      "planId" : this.planId
    };

    let request = {
      path: 'auth/membershipType/numberFormat/',
      data : data,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK' || response['status']['code'] == 'UPDATED' || response['status']['code'] == 'CREATED')
      {
        this.samplePreview = response['data']['memberNumber'];
      }else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
}
