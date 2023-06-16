import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {SpinnerService} from '../../../../services/spinner.service';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-event-new',
  templateUrl: './create-event-new.component.html',
  styleUrls: ['./create-event-new.component.scss']
})
export class CreateEventNewComponent implements OnInit {
  
  eventDetail: any = [];
  currentConfigDetail :any ={};
  basicInformation: any = [];
  imageDescription: any = [];
  configuration: any = [];
  pricing: any = [];
  register:any=[]
  donation: any = [];
  discountRefund: any = [];
  session: any = [];
  customInfo: any = [];
  invoiceInfo: any = [];
  additonalInfo:any=[]
  dynamicField: any[];
  step: any = [];
  activeTabName = '';
  submitBasic: boolean = false;
  submitSubject: Subject<any> = new Subject();

  submitNext: Subject<any> = new Subject();
  submitConfig: Subject<any> = new Subject();
  publish: boolean = false;
  editTime = '';
  eventId = '';
  lastStep = '';
  saveBtn: boolean = true;
  eventConfigStatus: boolean = false;
  eventConfigDetail: any = [];
  customTemplate: boolean;
  addInfo :any=[]
  constructor(private cd: ChangeDetectorRef,private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, public toastrService: ToastrService) {

    this.route.params.subscribe(params =>
      this.eventId = params['string']
    );
    this.route.params.subscribe(params =>
      this.editTime = params['string']
    );
    //console.log(this.editTime);
  }

  async ngOnInit() {

    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (!authDetail) {
      this.router.navigate(['/login']);
    } else {
    await this.getEventConfigDetail();
      if (this.eventId != undefined) {
        await this.getEventDetail();
        this.dynamicFieldType();
        this.submitBasic = true;
      }
    }
    //console.log('test');
    //this.toastrService.success('test');
    this.getStep();
  }

  dynamicFieldType() {
    let request = {
      path: "event/dynamicFieldType",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.dynamicField = response['data'];
    });
  }
  completeConfig()
  {
    this.eventConfigStatus = true;
    if(!this.currentConfigDetail['templateConfig']){
      this.customTemplate = true;
    }else{
      this.customTemplate = false;
    }
    this.currentConfigDetail['customTemplate'] = this.customTemplate;
    
    document.querySelector("body").removeAttribute('class'); ///remove body class after modal
  }
  getStep(status = false) {

    let postData = {};
    postData['customTemplate'] = true;
    if(this.eventId)
    {
      postData['eventId'] = this.eventId;
    }else{
      postData['eventId'] = null
    }

    let data = {
      path: "event/eventCreateSteps",
      data : postData,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.step = response['data'];
        // console.log('123123',this.step);
        
          if(status == false)
          {
            this.step.forEach((item, index) => {
                this.step[0]['active'] = true;
            });
            this.activeTabName = this.step[0]['step'];
          }
        let s = this.step.length;
        this.lastStep = this.step[s - 1]['step'];

        //console.log(this.step[s-1]);
      }
    });

  }

  openActiveTab(tabName) {
  

    this.nextBackActiveTab(tabName, 'current');
  }
  getEventConfigDetail() {
    this.spinner.show();
    let request = {
      path: 'event/template/getAll',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.eventConfigDetail = response['data'];
        this.eventConfigDetail.map((item) => {
          item['configurationQuestions'].map((question) => {
            question['options'].map((options) => {
              options['selected']= false;
            });
          });
        });
        resolve(null);
        this.spinner.hide();
      });
    });
  }
  nextBackActiveTab(currentTabName, type) {
 
    setTimeout(() => {  
      let step;

      this.step.filter(function (entry, index) {
        if (entry.step == currentTabName) {
          step = index;
// console.log('123123',step);       

        }
      });
    
      if (type == 'next') {
        step = step + 1;
        // this.step.forEach((item, index) => {            
        //   if (this.activeTabName == item['step']) {
        //     this.step[index]['active'] = true;
        //   }
        // });

      } else if (type == 'back') {
        step = step - 1;
        this.step.forEach((item, index) => {            
          if (this.activeTabName == item['step']) {
            this.step[index]['active'] = false;
          }
        });

      }if(step == -1){
        this.eventConfigStatus = false;
        this.submitConfig.next(this.customTemplate);
      }else {
        if (this.submitBasic == false) {
          this.toastrService.error('Save the event !');
        } else
        {
          // this.step.forEach((item, index) => {
          //   console.log(this.activeTabName, item['step']);
          //   if (this.activeTabName == item['step']) {
          //     this.step[index]['active'] = true;
          //   }
          // });
          let tab;
          if (step >= 0 && step < this.step.length) {
            tab = this.step[step]['step'];
            this.activeTabName = tab;
            
          }
          this.saveBtn = true;
          if (tab == 'PRICING' || tab == 'DISCOUNT_REFUND' ||
            tab == 'CUSTOM_INFO' || tab == 'SESSION') {
            this.saveBtn = false;
          }
          if (type == 'finish') {
            this.router.navigate(['my-event/draft']);
          }


        }
      }
      this.step.forEach((item, index) => {

        // if (type == 'next'){
        //   this.step[index]['active'] = true;
        //   console.log('123123',this.step);

        // } if (type == 'back') {
        //   this.step[index]['active'] = false;

        // }
        
        if (this.activeTabName == item['step']) {
          this.step[index]['active'] = true;
          console.log('123123',this.step); 
          
        }

      });
    }, 1000);
    //this.getStep(true);
    window.scrollTo(0, 0);

  }

  getEventDetail() {
    let data = {
      path: "event/details/" + this.eventId,
      isAuth: true
    };
    return new Promise((resolve) => {
      this.apiService.get(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
          this.currentConfigDetail['templateConfig'] = [];
          this.currentConfigDetail['templateConfig']['configurationAnswers'] =  this.eventDetail['configurationAnswers'];
          this.currentConfigDetail['templateConfig']['id'] =  this.eventDetail['templateId'];
          this.eventConfigDetail.map((item) => {
            if(item['id'] == this.eventDetail['templateId'])
            {
             item['configurationQuestions'] = this.eventDetail['configurationAnswers'];
            }
          });
          this.basicInformation = this.eventDetail;
          this.configuration = this.eventDetail['eventConfigurations'];
          this.customInfo = this.eventDetail['dynamicFields'];
          this.invoiceInfo = this.eventDetail['eventInvoiceInfo'];

          this.imageDescription['description'] = this.eventDetail['description'];
          this.imageDescription['otherPictures'] = this.eventDetail['otherPictures'];
          this.imageDescription['profilePicture'] = this.eventDetail['profilePicture'];
          this.imageDescription['bannerPicture'] = this.eventDetail['bannerPicture'];
          this.imageDescription['tags'] = this.eventDetail['tags'];
          this.imageDescription['polls'] = this.eventDetail['polls'];
          this.imageDescription['termsAndCondition'] = this.eventDetail['termsAndCondition'];
          this.imageDescription['otherDocuments'] = this.eventDetail['otherDocuments'];
          this.imageDescription['sortDescription'] = this.eventDetail['sortDescription'];
          if(this.eventDetail['templateId'] == null)
          {
            this.eventDetail['customTemplate'] = true;
          }
          this.submitConfig.next(this.eventDetail['customTemplate']);
        }
        resolve(null);
      });
    });
  }

  completeStep() {
    if(this.eventId ==undefined){
    this.eventId = this.basicInformation['id'];}
    console.log(this.eventId);
    this.submitBasic = true;
    this.getEventDetail();


    if (this.publish == true) {
     
      if( this.eventDetail['eventConfigurations']['allowSponsorship']==true&&this.register['sponsor_list'].length==0)
      {
        this.toastrService.error("please atleast one plan")
      }
      else
      {
      this.nextBackActiveTab(this.activeTabName, 'publish');
      this.publish = false;
      }
    }
   // this.getsteponnext()
  }

  click(type) {
    console.log(this.register['ticket_list'])
    console.log("sponsorlist",this.register['sponsor_list'],this.eventDetail['eventConfigurations']['allowSponsorship'])
   if((this.eventDetail['eventConfigurations']['registrationType']=='AGE'||this.eventDetail['eventConfigurations']['registrationType']=='CATEGORY') && this.register['ticket_list'].length==0){
    this.toastrService.error("Please add ticket category")
   }
    else if( (this.eventDetail['eventConfigurations']['allowSponsorship']==true&&this.register['sponsor_list'].length==0))
      {
        this.toastrService.error("Please add atleast one sponsor plan")
      }
      else if((this.eventDetail['eventConfigurations']['allowDonor']==true&&this.register['donation_list'].length==0))
     {
      this.toastrService.error("Please add atleast one donation plan")
     }
     else if((this.eventDetail['eventConfigurations']['allowFood']==true&&this.register['food_list'].length==0))
     {
      this.toastrService.error("Please add atleast one food")
     }
     else if((this.eventDetail['eventConfigurations']['allowParking']==true&&this.register['parking_list'].length==0))
     {
      this.toastrService.error("Please add atleast one parking slot")
     }
     else if((this.eventDetail['eventConfigurations']['accommodationOption']==true&&this.register['accommodation_list'].length==0))
     {
      this.toastrService.error("Please add atleast one accomodation category")
     }
      else{
        this.publish = true;
          this.spinner.show();
          let stateForm = {'eventState': 'PUBLISHED'};
          let data = {
            path: "event/changeState/" + this.eventId,
            data: stateForm,
            isAuth: true
          };
          this.apiService.post(data).subscribe(response => {
            if (response['status']['code'] == 'OK') {
              this.toastrService.success(response['status']['description']);
              this.spinner.hide();
              this.router.navigate(['my-event']);
            } else {
              this.toastrService.error(response['status']['description']);
              this.spinner.hide();
            }
          });
      }
  }

  save(flag:boolean){

    this.submitSubject.next(flag);
    // this.getStep(true);

    // console.log("subject called",this.activeTabName)
   if(this.activeTabName=='ADDITIONAL_INFORMATION'){
     this.getStep(true);
     this.nextBackActiveTab(this.activeTabName,'next')
   }
  }

  toast(){
    this.toastrService.success("Event saved successfully to draft!")
  }

  getsteponnext()
  {
    let postData = {};
    postData['customTemplate'] = this.customTemplate;
    if(this.eventId)
    {
      postData['eventId'] = this.eventId;
    }else{
      postData['eventId'] = null
    }

    let data = {
      path: "event/eventCreateSteps",
      data : postData,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.step = response['data'];
        //this.cd.detectChanges();
        this.step.forEach(element => {

          if(this.activeTabName==element.step)
        {

          this.nextBackActiveTab(this.activeTabName,'next')
        }
        });


      }
    });
  }


}
