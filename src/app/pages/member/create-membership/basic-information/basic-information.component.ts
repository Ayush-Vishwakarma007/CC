import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, Subscription} from "rxjs";
import {SpinnerService} from '../../../../services/spinner.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent implements OnInit {
  basicMembershipForm: FormGroup;
  optionList: any[] = [{durationType: '', price: '',duration:0,sequentialGenerationNumber:1,disabled:true}];
  dynamicField: any[];
  durationList: any=[];
  benefitList: any [] = [{benifit: ''}];
  membershipList: any = [];
  storevalue:any=[]
  submitted: boolean = false;
  editId = '';
  editData: any = [];
  setReminder:boolean = false;
  reminderList :any =[];
  event1:boolean;

  @Input()
  save: Subject<any>;
  isShown: boolean = false ;
  saveSubscription: Subscription;
  disablePlanReqData:any=[]
  defaultValue:boolean=true
  @Output() completed: EventEmitter<any> = new EventEmitter();

  @Output() membershipDetailChange: EventEmitter<any> = new EventEmitter();

  k:any ;
  isSwitchedOn:boolean;
  btnValue:boolean;

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.basicMembershipForm = this.formBuilder.group({
      name: ['', Validators.required],
      provideDiscount: [false],
      description: ['', Validators.required],
      disabled:[false]
    });
    this.disablePlanReqData={
      disabled:false,
      id:this.editId

    }

  }

  _membershipDetail: any;

  @Input()
  get membershipDetail() {
    return this._membershipDetail;
  }

  set membershipDetail(value) {
    this._membershipDetail = value;
    this.membershipDetailChange.emit(value);
  }

  get regFormCon() {
    return this.basicMembershipForm.controls;
  }

  async ngOnInit() {
    this.reminderList.push({days: '', type: ''});
    await this.getMembershipList();
    await this.getDurationType();
    this.saveSubscription = this.save.subscribe(() => {
      this.submitted = true;
    });
    window.scroll(0,0);

  }
  // onChange(e) {
  //   console.log(e);
  //   this.isSwitchedOn=e;
  //   if(e='true') {
  //     this.btnValue=true;
  //   }
  //   else {
  //     this.btnValue=false;
  //   }
  //   console.log("disable: ",this.btnValue)
  // }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  onBlur(event){
    if(event.target.value !== '')
     event.target.value = parseFloat(event.target.value).toFixed(2)
    }

  addDynamicField() {

    this.optionList.push({durationType: '', price: '',duration:0,sequentialGenerationNumber:1,disabled:true});

  }

  addBenefit() {
    this.benefitList.push({benifit: ''});
  }

  removeIndex(i) {
    this.optionList.splice(i, 1);
  }

  removeLastOption(i) {
    this.optionList.splice(i, 1);
  }

  getArrayDetailById(array, find, value) {
    let id = '';
    array.filter(function (entry, index) {
      if (entry[find] == value) {
        id = entry['id'];
      }
    });
    return id;
  }

  removeLastBenefit(i) {
    this.benefitList.splice(i, 1);
  }

  getMembershipList() {
    let request = {
      path: 'auth/membershipType/getAll',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.membershipList = response['data'];
      this.storevalue=response['data']['content']

      this.membershipList.forEach((item, index) => {
        if(item['disabled']==false){
          item['disabled']=true;
        }else{
          item['disabled']=false;
        }
        });
      this.membershipList.forEach((item, index) => {

        item['plans'].forEach(p => {
            let duration = this.durationList.filter(i => p.durationType == i.value);

          if (duration) {
            p['durationName'] = duration[0]["name"];

            p['allowDuration'] = duration[0]['allowDuration'];
            p['displayName'] = duration[0]['displayName'];
          }

        });
      });
    });
  }

  getDurationType() {
    let request = {
      path: 'auth/durationType',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.durationList = response['data'];
        //this.durationList[1].value = "Annual"
       // this.durationList[2].value = "Monthly"

        this.membershipList.forEach((item, index) => {
          item['plans'].forEach(p => {
            let duration = this.durationList.filter(i => p.durationType == i.value);
            if (duration) {
              p['durationName'] = duration[0]['name'];
              p['displayName'] = duration[0]['displayName'];
              p['allowDuration'] = duration[0]['allowDuration'];
            }
          });
        });
        //resolve();
      });
    });
  }
    setTypeId(val,data){
        if(val.allowDuration == true){
          data.isShown = ! this.isShown;
        }else{
          data.isShown = false;
        }
    // if(val=="YEAR"){
    //   data.isShown = ! this.isShown;
    // }else{
    //   data.isShown = false;
    // }
  }
  /*selection(event,data)
  {
    data.disabled=event
    console.log(data.disabled)

  }*/
  submit() {
   // console.log("k is " ,this.k);
    let submit= true;
    this.spinner.show();
    let optionList=[]
    if(this.basicMembershipForm.value.description!='' && this.basicMembershipForm.value.description!=''){
     optionList = this.optionList.filter(item => item.durationType!= '' && item.price != '' || item.duration != '');
    }
     let benefitList = this.benefitList.filter(item => item.benifit != '');
    let reminderList = this.reminderList.filter(item => item.type !=''  && item.days !='');
    optionList.forEach((val, index) => {

      val['durationType'] = val.durationType.value
      if(val.isShown ==true){

        if(val.duration < 0 || val.duration > 100 || val.price =='' || val.duration == '' ){
          this.toastrService.error("Please enter valid year or amount");
          submit = false;
          this.spinner.hide();

        }else{
          submit =true;

        }
      }
      console.log("a ",val['disabled'].value)
      // if(val['disabled']==true)
      // {
      //  val['disabled']=false
      // }
      // else{
      //   val['disabled']=true

      // }
    });
      let benefits = [];
    let benefit = benefitList.filter(function (entry, index) {
      benefits.push(entry.benifit);
    });
    if (this.editId != '') {
      optionList.forEach((item, index) => {
        let data = this.getArrayDetailById(this.editData['plans'], 'durationType', item.durationType);
        optionList[index]['id'] = data;
        console.log(optionList[index]['disabled'])

      });
    }
    if(this.setReminder == false)
    {
      reminderList =[];
    }
    if(this.setReminder == true && reminderList.length == 0)
    {
      this.toastrService.error("Please fill all required fields!");
      this.spinner.hide();
      return false;
    }

    if (this.basicMembershipForm.valid && optionList.length != 0 || benefits.length != 0) {
      if(submit==true){
      let formval = this.basicMembershipForm.value;
      formval['plans'] = optionList;
      formval['benefits'] = benefits;
      formval['remainders'] = reminderList;

      let data = {};
      if (this.editId != '') {
        if(this.basicMembershipForm.value.disabled==false){
          formval['disabled'] = true;
        }else{
          formval['disabled'] = false;
        }
        data = {
          path: "auth/membershipType/update/" + this.editId,
          data: formval,
          isAuth: true
        };
      } else {
        formval['disabled'] = false;
        data = {
          path: "auth/membershipType/create",
          data: formval,
          isAuth: true
        };
      }

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK' || response['status']['code'] == 'CREATED') {
          this.submitted = false;
          this.completed.emit();
          this.editId = '';
          this.basicMembershipForm.reset();
          this.basicMembershipForm.patchValue({
            provideDiscount: false,
          });
          this.basicMembershipForm.patchValue({
            disabled: false,
          });
          this.optionList = [{durationType: '', price: '',duration:0,sequentialGenerationNumber:1,disabled:true}];
          this.benefitList = [{benifit: ''}];
          this.setReminder = false;
          this.reminderList = [{type: '', days: ''}];
          this.toastrService.success(response['status']['description']);
          this.getMembershipList();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    }
    else {
      this.spinner.hide();
      this.submitted = true;
      this.toastrService.error("Please fill all required fields!");

    }
  }

  edit(data) {
    this.editData = data;
    console.log(data.plans)
    this.editId = data.id;
    this.basicMembershipForm.patchValue({
      name: data.name,
      provideDiscount: data.provideDiscount,
      description: data.description,
      disabled:data.disabled
    });
    this.optionList = [];
    data.plans.forEach((item, index) => {

      this.durationList.forEach((val, i) => {

      if(val.value == item.durationType){
        if(val.allowDuration == true){
          item.isShown = ! this.isShown;
        }else{
          item.isShown = false;
        }

        // if(item.disabled==true){
        //   item.disabled=false
        //   console.log(item.disabled)
        // }
        // else{
        //   item.disabled=true
        //   console.log(item.disabled)
        // }
        this.optionList.push({durationType: val, price: item.price,duration:item.duration,isShown:item.isShown,sequentialGenerationNumber:item.sequentialGenerationNumber,disabled:data.disabled});

      }
      });
    });
    this.benefitList = [];
    data.benefits.forEach((item, index) => {
      this.benefitList.push({benifit: item});
    });
    window.scrollTo(0, 0);
    if(data.remainders.length != 0)
    {
      this.setReminder = true;
      this.reminderList = data.remainders;
    }

  }

  delete(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this membership plan!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: 'auth/membershipType/delete/' + id,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(response => {
          if(response["status"]["code"] == "OK")
          {
          Swal.fire(
            'Deleted!',
            'Membership plan has been deleted.',
            'success'
          );
          }
          if( response["status"]["status"] == "ERROR")
          {
          this.toastrService.error(response["status"]["description"]);

          }
          this.getMembershipList();
        }, error => {
          Swal.fire(
            'Cancelled',
            'Membership plan is safe.',
            'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your membership plan is safe.',
          'error'
        )
      }
    })
  }
  addReminder() {
    this.reminderList.push({days: '', type: ''});
  }

  removeReminder(i) {
    this.reminderList.splice(i, 1);
  }
  activeDeactiveplan(id,event){
    // this.disablePlanReqData['disabled']=true
    if(event==true){
     event = false;
    }
    else if(event==false) {
     event=true
    }
    let req = {
      path: "auth/membershipType/updateStatus",
      data: this.disablePlanReqData,
      isAuth: true,
    };

    this.disablePlanReqData["id"]=id
    this.disablePlanReqData["disabled"]=event
    this.defaultValue= this.disablePlanReqData["disabled"]
    this.apiService.post(req).subscribe((response) => {

    });
    }
}
