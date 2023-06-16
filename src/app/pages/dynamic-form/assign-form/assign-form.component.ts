import {Component, OnInit, TemplateRef, Input, OnDestroy} from '@angular/core';
import {ApiService} from '../../../services/api.service';

import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Subject, Subscription} from 'rxjs';
// import {AlertService} from 'ngx-alerts';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {DatePipe, Location} from "@angular/common";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-assign-form',
  templateUrl: './assign-form.component.html',
  styleUrls: ['./assign-form.component.scss']
})
export class AssignFormComponent implements OnInit {
  modalRef: BsModalRef;
  routingSubscription: Subscription;
  checkValue: any;
  formId: any;
  formDetails: any = [];
  reqData: any = [];
  optionList: any = [];
  submitted: any;
  checked: boolean = true;
  userList: any = [];
  userFilter: any = []
  businessId: any;
  checkbox:boolean = false;
  openModelSubject: Subject<any> = new Subject();
  constructor(public apiService: ApiService, public location: Location, private modalService: BsModalService, private fb: FormBuilder, 
    //private alertService: AlertService, 
    public router: ActivatedRoute, public authService: AuthenticationService, public r: Router, private datePipe: DatePipe) {
  }

  async ngOnInit() {
    this.authService.CheckLoginSession();
    localStorage.removeItem('formId');
    localStorage.removeItem('formDetails');
    localStorage.removeItem('redirect');
    localStorage.removeItem('copyForm');
    this.businessId = "cc_id";
    this.router.params.subscribe(params => {
      this.formId = params['id']
      this.getFormDetails();
    });
    this.routingSubscription = this.r.events.pipe(filter((x) => x instanceof NavigationEnd)).subscribe(() => {
      this.getFormDetails()
    })
    this.userFilter = {
      "filter": {},
      "page": {
        "limit": 10,
        "page": 0
      },
    };
  }

  assignFormModal(data){
    this.openModelSubject.next(data);
  }
  openModalWithUser(template: TemplateRef<any>, data, modelFilter) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-lg modal-dialog-centered list-user '})
    );
    if (modelFilter == 'role') {
      console.log([data]);
      this.userFilter['filter']['roles'] = [data]
    } else if (modelFilter == 'team') {
      this.userFilter['filter']['userIds'] = data['user']
    } else if (modelFilter == 'user') {
      this.userFilter['filter']['userIds'] = data
    }
    this.getUserList()
  };

  getUserList() {
    let req = {
      path: "auth/user/getUsers/",
      data: this.userFilter,
      isAuth: true
    };
    this.apiService.post(req).subscribe(response => {
      this.userList = response['data']
    });
  }

  changeOption(event) {
    this.optionList = [];
    if (event.value == "user") {
      this.getUsers();
    }
    if (event.value == "team") {
      this.getTeams();
    }
    if (event.value == "role") {
      this.getRoles();
    }
  }

  getUsers() {
    let reqData = {
      "filter": {},
      "page": {
        "limit": 100,
        "page": 0
      },
    };
    let data = {
      path: "auth/user/getUsers/",
      data: reqData,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      let user = response['data']['content']
      user.forEach((val) => {
        this.optionList.push({"id": val['id'], "name": val['firstName']});
      })
    });
  }

  getTeams() {
    this.businessId = "cc_id"
    let reqData = {
      "filter": {
        "businessId":this.businessId,
        "activeStatus":true
      }
    };
    let data = {
      path: "survey/team/getAllTeam",
      data: reqData,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      let team = response['data']
      team.forEach((val) => {
        this.optionList.push({"id": val['id'], "name": val['name']});
      })
    });
  }

  getRoles() {
    let data = {
      path: "auth/roles",
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      let role = response['data']
      role.forEach((val) => {
        this.optionList.push({"id": val['specificRole'], "name": val['specificRole']});
      })
    });
  }

  getFormDetails() {
    let data = {
      path: "survey/survey/details/" + this.formId,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      this.formDetails = response['data'];
    });
  }

  editForm() {
    localStorage.setItem('formId', this.formId);
    this.r.navigate(['/create-form/']);
  }
  copyForm() {
    localStorage.setItem('formId', this.formId);
    localStorage.setItem('copyForm', "copy-form");
    this.r.navigate(['/create-form/']);
  }
  viewForm(id){
    let data = {
      path: "survey/survey/getById/" + id,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      let formDetails: any = {};
      formDetails['id'] = response['data']['id']
      formDetails['name'] = response['data']['name']
      formDetails['description'] = response['data']['description']
      formDetails['formSteps'] = response['data']['formSteps'];
      localStorage.setItem('formDetails', JSON.stringify(formDetails));
      localStorage.setItem('redirect', "assign-form");
      this.r.navigate(['/preview-form']);
    });
  }

  modalUserListHide() {
    this.modalRef.hide();
    this.userFilter['filter'] = {}
    this.userFilter['page']['page'] = 0
    this.getUserList()
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  pagination(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {
        this.userFilter.page.page = this.userFilter.page.page - 1;
      } else if (type == 'current') {
        this.userFilter.page.page = current;
      } else {
        this.userFilter.page.page = this.userFilter.page.page + 1;
      }
      this.getUserList();
    }
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control && control.value && control.value.toString() || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : {'whitespace': true};
  }

}
