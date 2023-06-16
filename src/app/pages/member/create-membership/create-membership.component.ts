import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {SpinnerService} from '../../../services/spinner.service';
import {Subject} from "rxjs";

@Component({
  selector: 'app-create-membership',
  templateUrl: './create-membership.component.html',
  styleUrls: ['./create-membership.component.scss']
})
export class CreateMembershipComponent implements OnInit {

  step: any = [
    {stepNo: 1, name: "Basic Information", step: "BASIC_INFO", class: "icon-file"},
    {stepNo: 2, name: "Membership Number", step: "MEMBERSHIP_NUMBER", class: "icon-wallet numbericon"},
  ];
  submitBasic: boolean = false;
  activeTabName: any;
  membershipList: any = [];
  membershipDetail: any = [];
  durationList: any = [];
  editId = '';
  submitSubject: Subject<any> = new Subject();

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {


  }

  async ngOnInit() {
    document.querySelector("body").removeAttribute('class'); ///remove body class after modal
    window.scroll(0,0);
    this.activeTabName = this.step[0]['step'];
  }

  charOnly(evt): boolean {
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :
      ((evt.which) ? evt.which : 0));
    if (charCode > 32 && (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  openActiveTab(tabName) {
    console.log("called",tabName)
    this.nextBackActiveTab(tabName, 'current');
  }

  nextBackActiveTab(currentTabName, type) {
    console.log(currentTabName, type)
    let step;
      this.step.filter(function (entry, index) {
        if (entry.step == currentTabName) {
          step = index;
        }
      });
      if (type == 'next') {
        step = step + 1;
      } else if (type == 'back') {
        step = step - 1;
      }
    this.step.forEach((item, index) => {
      if (this.activeTabName == item['step']) {
        this.step[index]['active'] = true;
      }
    });
    if (step >= 0 && step < this.step.length) {
      let tab;
      tab = this.step[step]['step'];
      this.activeTabName = tab;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }


  getDurationType() {
    let request = {
      path: 'auth/durationType',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.durationList = response['data'];
    });
  }
  completeStep() {
    this.submitBasic = true;
   // this.nextBackActiveTab(this.activeTabName, 'next');
  }


}
