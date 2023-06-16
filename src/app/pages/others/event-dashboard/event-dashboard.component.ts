import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as  Highcharts from 'highcharts';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, filter} from 'rxjs/operators';
import Swal from "sweetalert2";
import {Location} from '@angular/common';
import {SpinnerService} from '../../../services/spinner.service';
import {ToastrService} from 'ngx-toastr';
import {EMAIL_PATTERN} from "../../../helpers/validations";
import {Subject} from "rxjs";

@Component({
  selector: 'app-event-dashboard',
  templateUrl: './event-dashboard.component.html',
  styleUrls: ['./event-dashboard.component.scss']
})
export class EventDashboardComponent implements OnInit {
  searchBox: FormControl = new FormControl('');
  searchString:string='';

  eventDetail: any = [];
  notificationForm: FormGroup;
  paymentArray: any = [];
  donationChartActiveTab:any = 'DAY';
  doChartActiveTab:any = 'DAY';
  regChartActiveTab:any = 'DAY';
  earningChartActiveTab:any = 'DAY';

  selfCreted:boolean = false;

  userNotificationId = '';
  memberCollection = 0;
  vendorCollection: any;
  totalDonorcollection: any;
  totalSponsercollection: any;
  totalFoodcollection: any;
  //============== Statistics variable =============
  submitBtn: boolean = true;
  sideMenuLarge: boolean = true;
  eventId: any = '';
  earningChartData: any = [];
  regChartData: any = [];
  tickitSoldChartData: any = [];
  tickitSoldData: any;
  collectionChartData: any = [];
  donorcollectionChartData: any = [];
  donorsChartData: any = [];
  tickitSoldcollectionData: any;

  dashboardTotalColetion: any;
  notificationAudience: any = [];
  //============== member variable =============
  memberTypes: any;
  totalMember: any;
  totalAmount: any = [];
  registredUser: any = [];
  vendors: any = [];
  addDonorForm: FormGroup;
  addGuestMemberForm: FormGroup;
  submitSubject: Subject<any> = new Subject();
  donateSubject: Subject<any> = new Subject();
  //================= food =================
  foodItem: any;
  typeForDonation = 'donor';
  //======================== donor and sponser =============================
  donorList: any = [];
  sponserList: any = [];
  authDetail :any = [];
  adminList: any = [];
  volunteerList: any = [];
  reqData: any = [];
  submitDonor: boolean = true;
  //=========================================================================
  width = 0;
  defaultDonation= '';
  regestredReqData: any = [];
  subMember: any = [];
  currentTab = '';
  donationList :any =[];
  editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "auto",
    "minHeight": "250px",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "Enter text here...",
    "imageEndPoint": "",
    "toolbar": [
      ["bold", "italic", "underline"],
      [{'header': 1}, {'header': 2}],

      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      // ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      // ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
      ["link"]

    ]
  };
  @ViewChild("registrationChart", {read: ElementRef}) registrationChart: ElementRef;
  @ViewChild("earningChart", {read: ElementRef}) earningChart: ElementRef;
  @ViewChild("tickitSold", {read: ElementRef}) tickitSold: ElementRef;
  @ViewChild("diffchart", {read: ElementRef}) diffchart: ElementRef;
  @ViewChild("collectionChart", {read: ElementRef}) collectionChart: ElementRef;
  @ViewChild("donorcollectionChart", {read: ElementRef}) donorcollectionChart: ElementRef;
  @ViewChild("donorsChart", {read: ElementRef}) donorsChart: ElementRef;

  constructor(private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.notificationForm = this.formBuilder.group({
      message: ['', Validators.required],
      subject: ['', Validators.required],
      notificationAudiences: [''],
    });
    this.route.params.subscribe(params =>
      this.eventId = params['string']
    );
    this.addDonorForm = this.formBuilder.group({
      email: ['', [Validators.pattern(EMAIL_PATTERN), Validators.required]],
      firstName: ['', [ Validators.required]],
      lastName: ['', [ Validators.required]],
      paymentMethodUsed: ['', [ Validators.required]],
      amount: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
    });
    this.addGuestMemberForm = this.formBuilder.group({
      id: [''],
      allowedLogin: [true],
      email: ['', [Validators.pattern(EMAIL_PATTERN), Validators.required]],
      firstName: [null, [ Validators.required ,Validators.pattern('[a-zA-Z ]*$')]],
      lastName: [null, [ Validators.required ,Validators.pattern('[a-zA-Z ]*$')]],
      relation: ['GUEST'],
    });
    localStorage.removeItem('eventUrl');
    this.reqData = {
      "filter": {
        "donationType": 'DONATION',
        "eventId": this.eventId,
        "successfulPayment": true
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE"
      }
    };
    this.regestredReqData = {
      "filter": {
        "responsiblePerson": true,
        "roles": [
          "USER"
        ],
        "search": ""
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };
  }

  ngOnInit() {

    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.eventDetail = response['data'];

      this.selfCreted = this.eventDetail.selfCreated;
      if (this.eventDetail.eventConfigurations.registrationFees != 0) {
        this.getrEarningChart();
      }
      let authDetail = JSON.parse(localStorage.getItem("authDetail"));
      if (authDetail)
      {
        this.regestredUser();
        this.AllcollectionChart();
        //====================== Statistics function ==================================\
        if(this.eventDetail.selfCreated == true)
        {
          this.getregistrationChart();
          this.gettickitSold();
          this.getMemberTypes();
          this.getAdmin();
          this.getVolunteer();
          this.actualAndExpected();
        }

      }
      this.getDonation();
      this.getDonors();
      this.getDonorCollectionChart();
      this.getDonorsChart();
      this.getNotificationAudience();


    });
    this.searchBox.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe((search) => {
      if (this.currentTab == 'user') {
        this.regestredUser(search);
      }
      if (this.currentTab == 'vendor') {
        this.getVendors(search);
      }
    });

    //this.getcollectionChart();
    //===================== member function ======================================

    //========================= food function =====================
    //this.getFoodDetail();
    //======================== donor and sponser =============================
    //this.getDonors();
    //this.getSponsers();


  }

  AllcollectionChart() {
    let req = {
      path: "event/event/total/USER/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(req).subscribe(response => {
      if(response['status']['code'] == 'OK' && response['data'])
      {
        this.memberCollection = response['data']['payment'];
      }
      //console.log(this.memberCollection);
    });

    let req2 = {
      path: "event/event/total/VENDOR/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(req2).subscribe(response => {
      if (response['data']) {
        this.vendorCollection = response['data']['payment'];
      }
    });

  }

  //======================== donor and sponser =============================
  Dsort(type) {
    if (type == 'name') {
      this.reqData['sort']['sortBy'] = 'FIRST_NAME';
    } else if (type == 'email') {
      this.reqData['sort']['sortBy'] = 'EMAIL';
    } else if (type == 'phone') {
      this.reqData['sort']['sortBy'] = 'PHONE';
    }else if (type == 'date') {
      this.reqData['sort']['sortBy'] = 'DATE';
    }else if (type == 'amount') {
      this.reqData['sort']['sortBy'] = 'TOTAL_PAYMENT';
    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
    }
    this.getDonors();
  }

  getDonors() {
    this.reqData['filter']['donationType'] = 'DONATION';
    let reqData = this.reqData;


    let req = {
      path: "event/sponsors",
      data: reqData,
      isAuth: true,
    };

    this.apiService.post(req).subscribe(response => {
      if (response['data']) {
        this.donorList = response['data'];
      }
    });

    let req1 = {
      path: "event/sponsor/total/DONATION/"+this.eventId,
      isAuth: true,
    };

    this.apiService.get(req1).subscribe(response => {
      this.totalDonorcollection = 0;
      if (response['data']) {
          this.totalDonorcollection = response['data']['payment'];
          this.width =  this.totalDonorcollection*100 / this.eventDetail['eventConfigurations']['donationGoal'];
      }
    });
  }

  Ssort(type) {
    if (type == 'name') {
      this.reqData['sort']['sortBy'] = 'FIRST_NAME';
    } else if (type == 'email') {
      this.reqData['sort']['sortBy'] = 'EMAIL';
    } else if (type == 'phone') {
      this.reqData['sort']['sortBy'] = 'PHONE';
    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
    }
    this.getSponsers();
  }
  getSponsers() {
    this.reqData['filter']['donationType'] = 'SPONSOR';
    let reqData = this.reqData;
    let req = {
      path: "event/sponsors",
      data: reqData,
      isAuth: true,
    };

    this.apiService.post(req).subscribe(response => {
      if (response['data']) {
        this.sponserList = response['data'];
        this.totalSponsercollection = 0;
        this.sponserList['content'].forEach((val, index) => {
          this.totalSponsercollection = this.totalSponsercollection + val.finalAmount;
        });
      }
    });
  }
  getNotificationReceipt(id) {
    let req = {
      path: "event/sponsorship/sendReceipt/"+id,
      isAuth: true,
    };

    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
      }else
      {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  // ===========================food function =================================
  getFoodDetail() {
    let req = {
      path: "event/foodCountList/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(req).subscribe(response => {
      this.foodItem = response['data'];
      this.totalFoodcollection = 0;
      this.foodItem.forEach((val, index) => {
        this.totalFoodcollection = this.totalFoodcollection + val.foodPrice;
      });

    });
  }

  //===================== member function ======================================
  getMemberTypes() {
    let request = {
      path: "event/ageGroup/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.memberTypes = response['data'];
      let total = 0;
      this.memberTypes.forEach((val, index) => {
        total = total + val.count;
      });
      // this.totalMember = total;

    });
  }

  getVendors(search = "") {
    delete this.regestredReqData['filter']['registrationId'];
    this.regestredReqData['filter']['responsiblePerson'] = true;
    this.regestredReqData['roles'] = ['VENDOR'];
    this.regestredReqData['filter']['roles'] = ['VENDOR'];
    this.regestredReqData['filter']['search'] = search;

    let req = {
      path: "event/getRegisteredUsers/" + this.eventId,
      data: this.regestredReqData,
      isAuth: true,
    };

    this.apiService.post(req).subscribe(response => {
      if (response['data']) {
        this.vendors = response['data'];
      }
      //console.log(this.vendors);
    });
  }

  getSubMember(id) {
    this.regestredReqData['filter']['registrationId'] = id;
    this.regestredReqData['filter']['responsiblePerson'] = false;
    let req = {
      path: "event/getRegisteredUsers/" + this.eventId,
      data: this.regestredReqData,
      isAuth: true,
    };

    this.apiService.post(req).subscribe(response => {
      this.subMember = response['data']['content'];
      //console.log(this.subMember);
    });
  }

  sort(type) {
    if (type == 'name') {
      this.regestredReqData['sort']['sortBy'] = 'FIRST_NAME';
    } else if (type == 'address') {
      this.regestredReqData['sort']['sortBy'] = 'ADDRESS';
    } else if (type == 'email') {
      this.regestredReqData['sort']['sortBy'] = 'EMAIL';
    } else if (type == 'phone') {
      this.regestredReqData['sort']['sortBy'] = 'PHONE';
    }else if (type == 'totalPayment') {
      this.regestredReqData['sort']['sortBy'] = 'TOTAL_PAYMENT';
    }
    if (this.regestredReqData['sort']['orderBy'] == 'ASC') {
      this.regestredReqData['sort']['orderBy'] = 'DESC';
    } else if (this.regestredReqData['sort']['orderBy'] == 'DESC') {
      this.regestredReqData['sort']['orderBy'] = 'ASC';
    }
    this.regestredUser();
  }

  vsort(type) {
    if (type == 'name') {
      this.regestredReqData['sort']['sortBy'] = 'FIRST_NAME';
    } else if (type == 'address') {
      this.regestredReqData['sort']['sortBy'] = 'ADDRESS';
    } else if (type == 'email') {
      this.regestredReqData['sort']['sortBy'] = 'EMAIL';
    } else if (type == 'phone') {
      this.regestredReqData['sort']['sortBy'] = 'PHONE';
    }else if (type == 'totalPayment') {
      this.regestredReqData['sort']['sortBy'] = 'TOTAL_PAYMENT';
    }
    if (this.regestredReqData['sort']['orderBy'] == 'ASC') {
      this.regestredReqData['sort']['orderBy'] = 'DESC';
    } else if (this.regestredReqData['sort']['orderBy'] == 'DESC') {
      this.regestredReqData['sort']['orderBy'] = 'ASC';
    }
    this.getVendors();
  }

  regestredUser(search = "") {
    this.searchString = search;
    delete this.regestredReqData['filter']['registrationId'];
    this.regestredReqData['filter']['responsiblePerson'] = true;
    this.regestredReqData['filter']['search'] = search;
    this.regestredReqData['filter']['roles'] = ['USER'];
    this.regestredReqData['roles'] = ["USER"];
    let req = {
      path: "event/getRegisteredUsers/" + this.eventId,
      data: this.regestredReqData,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      this.registredUser = response['data'];
      this.totalMember = response['data']['totalElements'];
      //console.log(this.registredUser);
    });
  }

  getEvent() {

    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.eventDetail = response['data'];
      //console.log(this.eventDetail);
    });
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  //====================== Statistics function ==================================
  gettickitSold() {
    let reqData = {};
    let request = {
      path: "event/ticketByCategory/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.tickitSoldcollectionData = response['data'];
    });


  }

  //actual and expensted chart
  actualAndExpected() {
    let reqData = {};
    let request = {
      path: "event/eventInsight/" + this.eventId,
      data: reqData,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {

      // response['data'].forEach((val, index) => {
      //   this.collectionChartData[index] = [val.donationType, val.totalAmount];
      //   //totalSold = totalSold +  val.totalAmount;
      // });
      let chartData = [];
      if (response['data']) {
        chartData = [{
          name: 'Actual Registration',
          y: response['data']['registrationCount']
        }, {
          name: 'Expected Registration',
          y: response['data']['expectedCapacity']
        }];
        this.dashboardTotalColetion = response['data']['totalCollection'];
      }
      let title = '';
      if (this.eventDetail.eventConfigurations.registrationFees != 0) {
        title = '<span style="color:gray;font-size:15px">Total Earning</span><br>' + '$' + this.dashboardTotalColetion;
      } else {
        title = '<span style="color:gray;font-size:15px">Total Member</span><br>' + response['data']['registrationCount'];
      }

      Highcharts.chart(this.diffchart.nativeElement, <any>{
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
        },
        colors: ['#2866a0', '#5384b3', '#7ea3c6', '#d4e0ec', '#a9c2d9'],
        title: {
          text: title,
          align: 'center',
          verticalAlign: 'middle',
          y: 30
        },
        tooltip: {
          enabled: true
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false
            },
            series: {
              states: {
                hover: {
                  enabled: false
                }
              }
            },
            startAngle: -360,
            endAngle: 140,
            center: ['50%', '50%'],
            size: '80%'
          },
        },
        credits: {
          enabled: false
        },
        series: [{
          type: 'pie',
          name: 'Collection',
          innerSize: '70%',
          data: chartData,
        }]
      });

    });


  }

  erChartClick(status){
    this.earningChartActiveTab = status;
    this.getrEarningChart();
  }

  getrEarningChart() {
    let reqData = {
      'successfulPayment': true,
      'eventId': this.eventId
    };

    let request = {
      path: "event/paymentByEvent/"+this.earningChartActiveTab,
      data: reqData,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      //console.log(response);

      // var monthNames = [
      //   "Jan", "Feb", "Mar",
      //   "Apr", "May", "Jun", "Jul",
      //   "Aug", "Sep", "Oct",
      //   "Nov", "Dec"
      // ];
      // let data = [];
      // if (response['data']) {
      //   data = response['data'];
      // }

      // data.forEach((val, index) => {

      //   let d = new Date(val.date);
      //   let day = d.getDate();
      //   let month = d.getMonth();

      //   let date = day + ' ' + monthNames[month];

      //   this.earningChartData[index] = [date, val.totalAmount];
      // });

      this.earningChartData = [];

      response['data'].forEach((val, index) => {
        this.earningChartData[index] = [val.date, val.totalAmount];
      });

      Highcharts.chart(this.earningChart.nativeElement, <any>{
        chart: {
          type: 'column'
        },
        colors: ['#2866a0'],
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          type: 'category',
          labels: {
            rotation: -70,
            style: {
              fontSize: '10px',
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Total Earning: <b>{point.y:1f}</b>'
        },
        series: [{
          type: 'column',
          name: 'Behavior',
          data: this.earningChartData,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return '$' + Highcharts.numberFormat(this.y, 2,'.',','); 
            }
          }
        }]
      });


    });
  }

  regChartClick(status){
    this.regChartActiveTab = status;
    this.getregistrationChart();
  }

  getregistrationChart() {
    let reqData = {
      'successfulPayment': true,
      'eventId': this.eventId
    };
    let request = {
      path: "event/registrationCount/"+this.regChartActiveTab,
      data: reqData,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      // var monthNames = [
      //   "Jan", "Feb", "Mar",
      //   "Apr", "May", "Jun", "Jul",
      //   "Aug", "Sep", "Oct",
      //   "Nov", "Dec"
      // ];

      // let data = [];
      // if (response['data']) {
      //   data = response['data'];
      // }
      // //console.log(data);

      // data.forEach((val, index) => {

      //   let d = new Date(val.date);
      //   let day = d.getDate();
      //   let month = d.getMonth();

      //   let date = day + ' ' + monthNames[month];

      //   this.regChartData[index] = [date, val.totalRegistration];
      // });

      this.regChartData = [];

      response['data'].forEach((val, index) => {
        this.regChartData[index] = [val.date, val.totalRegistration];
      });

      Highcharts.chart(this.registrationChart.nativeElement, <any>{
        chart: {
          type: 'column'
        },
        colors: ['#2866a0'],
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          type: 'category',
          labels: {
            rotation: -70,
            style: {
              fontSize: '10px',
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Total Registraion: <b>{point.y:1f}</b>'
        },
        series: [{
          type: 'column',
          name: 'Behavior',
          data: this.regChartData,
          dataLabels: {
            enabled: true,
          }
        }]
      });

    });

  }

  pagination(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {
        this.regestredReqData.page.pageNumber = this.regestredReqData.page.pageNumber - 1;
      } else if (type == 'current') {
        this.regestredReqData.page.pageNumber = current;
      } else {
        this.regestredReqData.page.pageNumber = this.regestredReqData.page.pageNumber + 1;
      }
      this.regestredUser();
    }
    if (data == 'vendor') {
      if (type == 'prev') {
        this.regestredReqData.page.pageNumber = this.regestredReqData.page.pageNumber - 1;
      } else if (type == 'current') {
        this.regestredReqData.page.pageNumber = current;
      } else {
        this.regestredReqData.page.pageNumber = this.regestredReqData.page.pageNumber + 1;
      }
      this.getVendors();
    }
    if (data == 'donor') {
      if (type == 'prev') {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber - 1;
      } else if (type == 'current') {
        this.reqData.page.pageNumber = current;
      } else {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
      }
      this.getDonors();
    }

    //console.log(this.regestredReqData.page);

  }

  collapsButton() {
    if (this.sideMenuLarge == true) {
      this.sideMenuLarge = false;
    } else {
      this.sideMenuLarge = true;
    }
  }

  changeTab(data) {
    let tab = data.tab.textLabel;
    //console.log(data.tab.textLabel);
    this.currentTab = tab;
    if (tab == 'user' || tab == 'vendor') {
      this.regestredReqData.page.pageNumber = 0;
      this.getVendors();
      this.regestredUser();
    }
    if (tab == 'donors') {
      this.getDonors();
      this.getDonorCollectionChart();
      this.getDonorsChart();
    }
    if (tab == 'sponsors') {
      this.getSponsers();
    }
    if (tab == 'dashboard') {
      this.getregistrationChart();
      if (this.eventDetail.eventConfigurations.registrationFees != 0) {
        this.getrEarningChart();
      }
      this.actualAndExpected();
    }
  }

  getAdmin() {
    let request = {
      path: "event/admins/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.adminList = response['data'];
    });
  }

  getVolunteer() {
    let request = {
      path: "event/volunteers/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.volunteerList = response['data'];
    });
  }

  publish() {
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
        this.getEvent();
        this.spinner.hide();
      }
    });
  }

  unPublish() {
    this.spinner.show();
    let stateForm = {'eventState': 'UNDER_REVIEW'};
    let data = {
      path: "event/changeState/" + this.eventId,
      data: stateForm,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.getEvent();
        this.spinner.hide();

      }
    });
  }

  cancel(sendMail) {
    this.spinner.show();
    let stateForm = {'eventState': 'CANCELED','sendMail':sendMail};
    $('#cancelClosed').trigger('click');
    let data = {
      path: "event/changeState/" + this.eventId,
      data: stateForm,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.getEvent();
        this.spinner.hide();
      }else
      {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();

      }
    });
  }

  userNoti(id) {
    //console.log(id);
    this.userNotificationId = id;
    this.notificationForm.reset();

  }

  submitNotification() {
    //console.log(this.userNotificationId);
    if (this.notificationForm.valid) {
      this.submitBtn = true;
      let data = {};
      let formData = this.notificationForm.value;
      delete formData.notificationAudiences;
      formData['onlyMainUsers'] = true;
      data = {
        path: "event/sendEmail/" + this.eventId + '/' + this.userNotificationId,
        data: formData,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.userNotificationId = '';
          $('#deleteNoti').click();
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitBtn = false;
        }
      });
    } else {
      this.submitBtn = false;
    }
  }

  submitAllNotification() {
    //console.log(this.userNotificationId);
    if (this.notificationForm.valid) {
      this.submitBtn = true;
      let data = {};
      let formData = this.notificationForm.value;
      if (formData.notificationAudiences == null) {
        formData.notificationAudiences = ['ALL'];
      }
      formData['onlyMainUsers'] = true;
      data = {
        path: "event/sendEmail/" + this.eventId,
        data: formData,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.userNotificationId = '';
          $('#deletesNoti').click();
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitBtn = false;
        }
      });
    } else {
      this.submitBtn = false;
    }
  }

  edit() {
    this.router.navigate(['edit-event-new/', this.eventId]);
  }

  delete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this event!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "event/delete/" + this.eventId,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Deleted!',
              'Event has been deleted.',
              'success'
            );
            this._location.back();
          }


        }, error => {
          Swal.fire(
            'Cancelled',
            'Event has been safe.',
            'error'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Event has been safe.',
          'error'
        );
      }
    })
  }

  getNotificationAudience() {
    let request = {
      path: "event/notificationAudience",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.notificationAudience = response['data'];
    });
  }

  deleteUser(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Participant!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "event/event/registration/" + id,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Deleted!',
              'Participant has been deleted.',
              'success'
            );
            this.regestredReqData.page.pageNumber = 0;
            this.getVendors();
            this.regestredUser();
          } else {
            Swal.fire(
              'Cancelled',
              response['status']['description'],
              'error'
            );
          }

        }, error => {
          Swal.fire(
            'Cancelled',
            'Participant has been safe.',
            'error'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Participant has been safe.',
          'error'
        );
      }
    })
  }

  getcollectionChart() {
    let reqData = {
      'eventId': this.eventId
    };
    let request = {
      path: "event/donationType",
      data: reqData,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      if (response['data']) {
        response['data'].forEach((val, index) => {
          this.collectionChartData[index] = [val.donationType, val.totalAmount];
          //totalSold = totalSold +  val.totalAmount;
        });
      }

      Highcharts.chart(this.collectionChart.nativeElement, <any>{
        chart: {
          type: 'column'
        },
        colors: ['#2866a0'],
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          type: 'category',
          labels: {
            rotation: -70,
            style: {
              fontSize: '10px',
            }
          }
        },
        plotOptions: {
          series: {
            pointWidth: 25
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Total Collection: <b>{point.y:1f}</b>'
        },
        series: [{
          type: 'column',
          name: 'Behavior',
          data: this.collectionChartData,
          dataLabels: {
            enabled: true,
          }
        }]
      });

    });
  }

  doChartClick(status){
    this.doChartActiveTab = status;
    this.getDonorsChart();
  }

  getDonorsChart() {
    let reqData = {
      'eventId': this.eventId,
      "donationType": 'DONATION',
      "successfulPayment": true
    };
    let request = {
      path: "event/sponsorCount/"+this.doChartActiveTab,
      data: reqData,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      // var monthNames = [
      //   "Jan", "Feb", "Mar",
      //   "Apr", "May", "Jun", "Jul",
      //   "Aug", "Sep", "Oct",
      //   "Nov", "Dec"
      // ];

      // let data = [];
      // if (response['data']) {
      //   data = response['data'];
      // }
      // //console.log(data);

      // data.forEach((val, index) => {

      //   let d = new Date(val.date);
      //   let day = d.getDate();
      //   let month = d.getMonth();

      //   let date = day + ' ' + monthNames[month];

      //   this.donorsChartData[index] = [date, val.totalRegistration];
      // });

      this.donorsChartData = [];

      response['data'].forEach((val, index) => {

        this.donorsChartData[index] = [val.date, val.totalRegistration];

      });


      Highcharts.chart(this.donorsChart.nativeElement, <any>{
        chart: {
          type: 'column'
        },
        colors: ['#2866a0'],
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          type: 'category',
          labels: {
            rotation: -70,
            style: {
              fontSize: '10px',
            }
          }
        },
        plotOptions: {
          series: {
            pointWidth: 25
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Total Donors: <b>{point.y:1f}</b>'
        },
        series: [{
          type: 'column',
          name: 'Behavior',
          data: this.donorsChartData,
          dataLabels: {
            enabled: true,
          }
        }]
      });

    });
  }

  dChartClick(status){
    this.donationChartActiveTab = status;
    this.getDonorCollectionChart();
  }

  getDonorCollectionChart() {
    let reqData = {
      'eventId': this.eventId,
      "donationType": 'DONATION',
      "successfulPayment": true
    };
    let request = {
      path: "event/sponsorPayment/"+this.donationChartActiveTab,
      data: reqData,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      // var monthNames = [
      //   "Jan", "Feb", "Mar",
      //   "Apr", "May", "Jun", "Jul",
      //   "Aug", "Sep", "Oct",
      //   "Nov", "Dec"
      // ];

      // let data = [];
      // if (response['data']) {
      //   data = response['data'];
      // }
      // //console.log(data);

      // data.forEach((val, index) => {

      //   let d = new Date(val.date);
      //   let day = d.getDate();
      //   let month = d.getMonth();

      //   let date = day + ' ' + monthNames[month];

      //   this.donorcollectionChartData[index] = [date, val.totalAmount];
      // });
      this.donorcollectionChartData = [];

      response['data'].forEach((val, index) => {
        this.donorcollectionChartData[index] = [val.date, val.totalAmount];
       });
      Highcharts.chart(this.donorcollectionChart.nativeElement, <any>{
        chart: {
          type: 'column'
        },
        colors: ['#2866a0'],
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          type: 'category',
          labels: {
            rotation: -70,
            style: {
              fontSize: '10px',
            }
          }
        },
        plotOptions: {
          series: {
            pointWidth: 25
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Total Collection: <b>${point.y:1f}</b>'
        },
        series: [{
          type: 'column',
          name: 'Behavior',
          data: this.donorcollectionChartData,
          dataLabels: {
            enabled: true,
            formatter: function() {
              // numberFormat takes your label's value and the decimal places to show
              return '$'+this.y;
            },
          },

        }]
      });

    });
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  getDonation()
  {
    let request2 = {
      path: 'event/getAllSponsorshipCategories/DONATION/' + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request2).subscribe(response => {
      if(response['data'])
      {
        this.donationList = response['data'];
        this.defaultDonation =  this.donationList[0]['id'];
      }
    });
  }
  resetDonor()
  {
    this.addDonorForm.reset();
    this.submitDonor = true;
  }
  addDonor() {
    this.spinner.show();
    if (this.addDonorForm.valid) {
        let detail = this.addDonorForm.value;
      this.submitDonor = true;
      detail['anonymousDonation'] =  false;
      detail['eventId']= this.eventId;
      let data = {
        path: "event/sponsorship",
        data: detail,
        isAuth: true
      };
      $('#donorClose').trigger('click');

      this.apiService.post(data).subscribe(response => {
        if(response['status']['code'] == 'OK' || response['status']['code'] ==  'SUCCESS')
        {
          this.spinner.hide();
          this.toastrService.success(response['status']['description']);
          this.addDonorForm.reset();
          this.getDonors();
          this.getDonorCollectionChart();
          this.getDonorsChart();
        }else {
          this.spinner.hide();
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {

      this.toastrService.error("Please fill all required fields!");
      this.submitDonor = false;
      this.spinner.hide();
    }
  }
  setDonationType(type) {
    // console.log('setDonationType');

    this.typeForDonation = type;
    // console.log(this.typeForDonation);
    setTimeout(() => {
      this.donateSubject.next(null);
    }, 300);
  }
  loginRedirect() {
    let url = 'event-dashboard/' + this.eventId;
    //console.log(url);

    localStorage.setItem('eventUrl', url);
    this.router.navigate(['/login'])
  }
  addGuest() {
    //console.log('addGuest');
    this.spinner.show();
    // console.log(this.addGuestMemberForm.value);
    if (this.addGuestMemberForm.valid) {
      if (this.eventDetail.eventConfigurations.registrationFees == 0) {
        if(this.eventDetail.eventConfigurations.fundRaisingEvent == true)
        {
          this.donateSubject.next(null);
        }
      } else {
        this.submitSubject.next(null);
      }
      $('#guestClose').trigger('click');
      $('#guestClosed').trigger('click');
      this.spinner.hide();
    } else {
      this.toastrService.error("Please fill all required fields!");
      this.submitBtn = false;
      this.spinner.hide();
    }
  }
  getPaymentToken() {
    this.submitDonation();
  }
  completepayment() {

    this.paymentArray['finalAmount'] = this.totalAmount['finalAmount'];
    this.paymentArray['successfulPayment'] = this.totalAmount['successfulPayment'];
    this.paymentArray['display'] = [];

    let tax = [];
    tax['name'] = 'Taxes';
    tax['value'] = this.totalAmount['tax'];
    tax['info'] = false;
    tax['description'] = '';

    let amount = [];
    if (this.totalAmount['type'] == 'donate') {
      amount['name'] = this.totalAmount['category']['categoryName'];
      amount['value'] = this.totalAmount['amount'];
      amount['info'] = true;
      amount['description'] = '';
    }
    this.paymentArray['display'].push(amount);
    this.paymentArray['display'].push(tax);
    this.paymentArray['type'] = this.totalAmount['type'];
    this.paymentArray['category'] = this.totalAmount['category'];
    this.paymentArray['amount'] = this.totalAmount['amount'];
    this.paymentArray['keepAnonymous'] = this.totalAmount['keepAnonymous'];
    //console.log(this.paymentArray);
    //console.log('completepayment');
    this.submitSubject.next(null);
  }
  skipDonation() {
    //console.log('skipDonation');
    $('#close').trigger('click');
    this.donationWithZero();
  }
  donationWithZero()
  {
    this.spinner.show();
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    let detail = {
      "amount": 0,
      "categoryId": null,
      "eventId": this.eventId,
      "donationType" : 'DONATION',
      "allowLogin": true,
      "nonce": null,
    };
    if(authDetail == null)
    {
      let guestDetail = this.addGuestMemberForm.value;
      detail['email'] = guestDetail['email'];
      detail['firstName'] = guestDetail['firstName'];
      detail['lastName'] = guestDetail['lastName'];
    }
    detail['paymentMethodUsed'] = 'PAYPAL';
    detail['anonymousDonation'] =  this.paymentArray['keepAnonymous'];
    let data = {
      path: "event/sponsorship/request",
      data: detail,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        if(response['status']['code'] != 'CONTINUE')
        {
          //  this.toastrService.success(response['status']['description']);
        }
        localStorage.setItem('eventId', this.eventId);
        this.router.navigate(['/payment/register/success']);
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  submitDonation() {
    this.spinner.show();
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    let detail = {
      "amount": this.paymentArray['finalAmount'],
      "categoryId": this.paymentArray['category']['id'],
      "eventId": this.eventId,
    };
    if(authDetail == null)
    {
      let guestDetail = this.addGuestMemberForm.value;
      detail['email'] = guestDetail['email'];
      detail['firstName'] = guestDetail['firstName'];
      detail['lastName'] = guestDetail['lastName'];
    }
    detail['paymentMethodUsed'] = 'PAYPAL';
    detail['anonymousDonation'] =  this.paymentArray['keepAnonymous'];
    let data = {
      path: "event/sponsorship/request",
      data: detail,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {

      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        if(response['status']['code'] != 'CONTINUE')
        {
          //this.toastrService.success(response['status']['description']);
        }
        if (response['data']['url'] != null) {
          localStorage.setItem('eventId', this.eventId);
          window.location.href = response['data']['url'];
        }
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.toastrService.error(response['status']['description']);
      }
    });
  }
// ================================ export - 29-04-200 | pradip kor =============================================

getCurrentDate(){
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //because January is 0!
  let yyyy = today.getFullYear();

  let date = '';
  let mon = '';

  if (dd < 10) {
    date = '0'+dd;
  }
  if (mm < 10) {
    mon = '0'+mm;
  }
  return(date+mon+yyyy);
}

exportMember(){
  let postData = {
    "filter": {
      "responsiblePerson": true,
      "roles": [
        "USER"
      ],
      "search": this.searchString
    },
    "page": {
      "pageLimit": 10,
      "pageNumber": 0
    },
    "sort": {
      "orderBy": "ASC",
      "sortBy": "FIRST_NAME"
    }
  };
  let req = {
    path: "event/getRegistrationExcel/"+ this.eventId,
    data: postData,
    isAuth: true,
  };

  let currentDate = this.getCurrentDate();

  let filename = 'Participants_'+currentDate+'_'+this.eventDetail.name;

  this.apiService.ExportReqBody(req ,filename);
}

ExportDoner(){
  let postData = {
    "filter": {
      "donationType": "DONATION",
      "eventId":  this.eventId,
      "successfulPayment": true
    },
    "page": {
      "pageLimit": 10,
      "pageNumber": 0
    },
    "sort": {
      "orderBy": "ASC",
      "sortBy": "FIRST_NAME"
    }
  };
  let req = {
    path: "event/sponsors/excel",
    data: postData,
    isAuth: true,
  };

  let currentDate = this.getCurrentDate();

  let filename = 'Donors_'+currentDate+'_'+this.eventDetail.name;

  this.apiService.ExportReqBody(req ,filename);

}

ExportSponser(){
  let postData = {
    "filter": {
      "donationType": "SPONSOR",
      "eventId":  this.eventId,
      "successfulPayment": true,
    },
    "page": {
      "pageLimit": 10,
      "pageNumber": 0
    },
    "sort": {
      "orderBy": "ASC",
      "sortBy": "FIRST_NAME"
    }
  };
  let req = {
    path: "event/sponsors/excel",
    data: postData,
    isAuth: true,
  };

  let currentDate = this.getCurrentDate();

  let filename = 'Sponsors_'+currentDate+'_'+this.eventDetail.name;

  this.apiService.ExportReqBody(req ,filename);

}






//===============================================================================================================






















  // getickitSoldChart() {
  //   let reqData = {};
  //   let request = {
  //     path: "event/paymentMethod/" + this.eventId,
  //     data: reqData,
  //     isAuth: true,
  //   };

  //   this.apiService.post(request).subscribe(response => {
  //     this.tickitSoldData = response['data'];

  //     let totalSold = 0;

  //     this.tickitSoldData.forEach((val, index) => {
  //       this.tickitSoldChartData[index] = [val.paymentMethodUsed, val.totalAmount];
  //       totalSold = totalSold + val.totalAmount;
  //     });

  //     this.dashboardTotalColetion = totalSold;

  //     Highcharts.chart(this.tickitSold.nativeElement, <any>{
  //       chart: {
  //         plotBackgroundColor: null,
  //         plotBorderWidth: 0,
  //         plotShadow: false
  //       },
  //       colors: ['#2866a0', '#5384b3', '#7ea3c6', '#d4e0ec', '#a9c2d9'],
  //       title: {
  //         text: '<span style="color:gray;font-size:15px">Total Earning</span><br>' + totalSold,
  //         align: 'center',
  //         verticalAlign: 'middle',
  //         y: 30
  //       },
  //       tooltip: {
  //         enabled: true
  //       },
  //       plotOptions: {
  //         pie: {
  //           dataLabels: {
  //             enabled: false
  //           },
  //           series: {
  //             states: {
  //               hover: {
  //                 enabled: false
  //               }
  //             }
  //           },
  //           startAngle: -360,
  //           endAngle: 140,
  //           center: ['50%', '50%'],
  //           size: '80%'
  //         },
  //       },
  //       credits: {
  //         enabled: false
  //       },
  //       series: [{
  //         type: 'pie',
  //         name: 'Collection',
  //         innerSize: '70%',
  //         data: this.tickitSoldChartData,
  //       }]
  //     });

  //   });


  // }

  // getearningChart() {

  //   let reqData = {};

  //   let request = {
  //     path: "event/registrationCount/" + this.eventId,
  //     data: reqData,
  //     isAuth: true,
  //   };

  //   this.apiService.post(request).subscribe(response => {
  //     var monthNames = [
  //       "Jan", "Feb", "Mar",
  //       "Apr", "May", "Jun", "Jul",
  //       "Aug", "Sep", "Oct",
  //       "Nov", "Dec"
  //     ];
  //     let data = response['data'];

  //     data.forEach((val, index) => {

  //       let d = new Date(val.date);
  //       let day = d.getDate();
  //       let month = d.getMonth();

  //       let date = day + ' ' + monthNames[month];

  //       this.earningChartData[index] = [date, val.totalRegistration];
  //     });

  //     Highcharts.chart(this.earningChart.nativeElement, <any>{
  //       chart: {
  //         type: 'column'
  //       },
  //       colors: ['#2866a0'],
  //       title: {
  //         text: ''
  //       },
  //       subtitle: {
  //         text: ''
  //       },
  //       xAxis: {
  //         type: 'category',
  //         labels: {
  //           rotation: -70,
  //           style: {
  //             fontSize: '10px',
  //           }
  //         }
  //       },
  //       yAxis: {
  //         min: 0,
  //         title: {
  //           text: ''
  //         }
  //       },
  //       legend: {
  //         enabled: false
  //       },
  //       credits: {
  //         enabled: false
  //       },
  //       tooltip: {
  //         pointFormat: 'Total Earning: <b>{point.y:1f}</b>'
  //       },
  //       series: [{
  //         type: 'column',
  //         name: 'Behavior',
  //         data: this.earningChartData,
  //         dataLabels: {
  //           enabled: true,
  //         }
  //       }]
  //     });


  //   });


  // }


}
