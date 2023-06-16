import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2'
import {CommunityDetailsService} from "../../../../services/community-details.service";

import * as  Highcharts from 'highcharts';
import { MenuService } from 'src/app/services/menu.service';
import { CommonService } from 'src/app/services/common.service';
import { pagination } from 'src/app/pagination';

@Component({
  selector: 'app-my-event',
  templateUrl: './my-event.component.html',
  styleUrls: ['./my-event.component.scss']
})
export class MyEventComponent implements OnInit {

  regChartActiveTab:any = 'DAY';
  erChartActiveTab:any = 'DAY';
  activeTab = 0;
  totalPages: any = [];
  eventList: any = [];
  data: any = [];
  type = '';
  dashboardTotalColetion :any =  [];
  regChartData: any = [];
  earningChartData: any = [];
  userPermisssion: any = [];
  chapterList: any = [];
  selectAllChapter: boolean = false;
  chapterIds: any = [];
  search=''
  pagelimit1:any=[]
  sort=[{label:'Date Time',value:'DATE_TIME'},{label:'Event Name',value:'NAME'}]
  defaultsort=this.sort[0].value;
  sorting:any
  @ViewChild("registrationChart", { read: ElementRef }) registrationChart: ElementRef;
  @ViewChild("earningChart", { read: ElementRef }) earningChart: ElementRef;
  @ViewChild("tickitSold", { read: ElementRef }) tickitSold: ElementRef;
  @ViewChild("diffchart", { read: ElementRef }) diffchart: ElementRef;

  @Output()
  notify:EventEmitter<any> = new EventEmitter<any>();

  @Output() onDatePicked = new EventEmitter<any>();
  

  constructor(private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService,public communityService: CommunityDetailsService, public menuService: MenuService, public common:CommonService) {
    this.data = {
      "filter": {
        search:this.search
      },
      "page": {
        "pageLimit": this.communityService.pagelimit,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE_TIME"
      }
    };
    this.route.params.subscribe(params => {
        this.type = params['type'];

        if(this.type =='dashboard'){this.activeTab = 0; }
        if(this.type =='ongoing'){this.activeTab = 1;}
        if(this.type =='upcoming'){this.activeTab = 2; }
        if(this.type =='past'){this.activeTab = 3; }
        if(this.type =='draft'){this.activeTab = 4; }

      });

    if(this.activeTab != 0){
      this.onLoad(this.type);
     }else
      {
        this.getregistrationChart();
        this.getrEarningChart();
        this.getickitSoldChart();
        this.actualAndExpected();
      }
  }

  async ngOnInit() {
    await this.getPermission();
    await this.getChapterList();
  }

  getPermission() {
    let req = {
      path: 'uiPermission/getPermissionByRole',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.userPermisssion = [];
          response['data'].forEach((item, index) => {
            this.userPermisssion[item.name] = item;
          });
        } else {
        }
        resolve(null);
      });
    });
  }

  getChapterList() {
    let request;

    if (this.userPermisssion['EVENT_CHAPTER_ACCESS']) {
      request = {
        path: "community/chapters",
        isAuth: true
      };
    } else {
      request = {
        path: 'community/chapters/access',
        isAuth: true,
      };
    }
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data'];
        if (this.chapterList.length != 0) {
          let id = [];
          this.chapterList.map((item) => {
            id.push(item['id']);
          })
          this.getChapterDetail(id);
        }
      });
      resolve(null);
    });
  }

  getChapterDetail(ids) {
    this.chapterIds = [];
    if (ids.length == 0) {
      this.chapterIds = [this.chapterList[0]['id']];
      this.toastrService.error('At least one chapter must be selected.')
    }
    if (ids.length == this.chapterList.length) {
      this.selectAllChapter = true;
    }
    else {
      this.selectAllChapter = false;
    }

    ids.forEach((item) => {
      this.chapterIds.push(item);
    })
    this.onLoad(this.type);
  }

  selectAllChange(event) {
    if (event.checked) {
      this.selectAllChapter = true;
      let array = [];
      this.chapterList.forEach((item, index) => {
        array.push(item.id);
      });
      this.chapterIds = array
    } else {
      this.chapterIds = [this.chapterList[0]['id']];
      this.selectAllChapter = false;
    }
    this.onLoad(this.type);
  }

  onLoad(type = '') {
  //  this.data['filter'] = [];
    if(type =='ongoing')
    {
      this.data['filter'] = {};
      this.data['filter']['eventTiming'] = "ONGOING";
      this.data['filter']['selfCreated']= true;
      this.data['filter']['eventState'] = "PUBLISHED";
      this.data['filter']['chapterIds'] = this.chapterIds
    }
    if(type =='upcoming')
    {
      this.data['filter'] = {};
      this.data['filter']['eventTiming'] = "UPCOMING";
      this.data['filter']['selfCreated']= true;
      this.data['filter']['eventState'] = "PUBLISHED";
      this.data['filter']['chapterIds'] = this.chapterIds
    }
    if(type =='past')
    {
      this.data['filter'] ={};
      this.data['filter']['eventTiming'] = "PAST";
      this.data['filter']['selfCreated']= true;
      this.data['filter']['eventState'] = "PUBLISHED";
      this.data['filter']['chapterIds'] = this.chapterIds
    }
    if(type =='draft')
    {
      this.data['filter'] = {};
      this.data['filter']['eventState'] = 'UNDER_REVIEW';
      this.data['filter']['selfCreated']= true;
      this.data['filter']['chapterIds'] = this.chapterIds
    }
    this.data['filter']['search'] = this.search;
    let request = {
      path: "event/find",
      data: this.data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.eventList = response['data'];
      this.totalPages = pagination.arrayTwo(this.eventList['totalPages'], this.data.page.pageNumber);      
    });

  }
  selected_pagelimit(event) {
    this.pagelimit1=event.value
    console.log(this.pagelimit1)
    this.data.page.pageLimit= this.pagelimit1;
    console.log(this.data.page.pageLimit)
    this. onLoad(this.type);

  }
  selected_sortBy(event){
    this.sorting=event.value
    this.data.sort.sortBy=this.sorting
    console.log(this.data.sort.sortBy)
    this.onLoad(this.type)
  }
  searchClick() {
    this.onLoad(this.search);
  }

  createEvent() {
    this.router.navigate(['/create-event-new']);
  }

  deleteEvent(id) {
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
          path: "event/delete/" + id,
          isAuth: true,
        }
        this.apiService.get(request).subscribe(response => {

          Swal.fire(
            'Deleted!',
            'Event has been deleted.',
            'success'
          )
          this.onLoad();

        }, error => {
          Swal.fire(
            'Cancelled',
            'Family member is safe.',
            'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Family Member is safe.',
          'error'
        )
      }
    })
  }

  getickitSoldChart() {
    // let data = [
    //   ['Cash', 100],
    //   ['Paypal', 80],
    //   ['Debit Card', 140],
    //   ['Strip', 125],
    //   ['Bank payment', 105],
    // ];
    // Highcharts.chart(this.tickitSold.nativeElement, <any>{
    //   chart: {
    //     plotBackgroundColor: null,
    //     plotBorderWidth: 0,
    //     plotShadow: false
    //   },
    //   colors: ['#2866a0', '#5384b3', '#7ea3c6', '#d4e0ec', '#a9c2d9'],
    //   title: {
    //     text: '<span style="color:gray;font-size:15px">Total Earning</span><br>' + 2500,
    //     align: 'center',
    //     verticalAlign: 'middle',
    //     y: 30
    //   },
    //   tooltip: {
    //     enabled: true
    //   },
    //   plotOptions: {
    //     pie: {
    //       dataLabels: {
    //         enabled: false
    //       },
    //       series: {
    //         states: {
    //           hover: {
    //             enabled: false
    //           }
    //         }
    //       },
    //       startAngle: -360,
    //       endAngle: 140,
    //       center: ['50%', '50%'],
    //       size: '80%'
    //     },
    //   },
    //   credits: {
    //     enabled: false
    //   },
    //   series: [{
    //     type: 'pie',
    //     name: 'Collection',
    //     innerSize: '70%',
    //     data: data,
    //   }]
    // });
  }

  erChartClick(status){
    this.erChartActiveTab = status;
    this.getrEarningChart();
  }

  getrEarningChart() {
    let reqData = {
      'selfCreated' :true
    };

    let request = {
      path: "event/paymentByEvent/"+this.erChartActiveTab,
      data: reqData,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      // console.log(response);

      // var monthNames = [
      //   "Jan", "Feb", "Mar",
      //   "Apr", "May", "Jun", "Jul",
      //   "Aug", "Sep", "Oct",
      //   "Nov", "Dec"
      // ];
      // let data = response['data'];

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
              return '$'+Highcharts.numberFormat(this.y,2,'.',',');
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
      'selfCreated' :true
    };

    let request = {
      path: "event/registrationCount/"+ this.regChartActiveTab ,
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
      // let data = response['data'];

      // console.log(data);

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

  actualAndExpected() {
    let reqData = {'selfCreated' :true};
    let request = {
      path: "event/eventInsight" ,
      data: reqData,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {

      // response['data'].forEach((val, index) => {
      //   this.collectionChartData[index] = [val.donationType, val.totalAmount];
      //   //totalSold = totalSold +  val.totalAmount;
      // });

      let chartData = [{
        name: 'Actual Registration',
        y: response['data']['registrationCount']
      }, {
        name: 'Expected Registration',
        y: response['data']['expectedCapacity']
      }];

      this.dashboardTotalColetion = response['data']['totalCollection'];

      Highcharts.chart(this.diffchart.nativeElement, <any>{
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
        },
        colors: ['#2866a0', '#5384b3', '#7ea3c6', '#d4e0ec', '#a9c2d9'],
        title: {
          text: '<span style="color:gray;font-size:15px">Total Earning</span><br>' + '$' +  this.dashboardTotalColetion.toFixed(2),
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
          data: chartData
        }]
      });

    });


  }

  pagination(type, current = null) {
    if (type == 'prev') {
      this.data.page.pageNumber = this.data.page.pageNumber - 1;
    } else if (type == 'current') {
      this.data.page.pageNumber = current;
    }
    else {
      this.data.page.pageNumber = this.data.page.pageNumber + 1;
    }
    this.onLoad();
    document.getElementById("page_form").scrollIntoView();
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  //for changing pagination tab wise
  changeTab(data){
    let tab  = data.tab.textLabel;    
    localStorage.setItem('eventselect', tab);
    this.type = tab
    if(tab == 'ongoing' || tab == 'upcoming' || tab == 'past' || tab == 'draft')
    {
      if(tab=='past'){this.router.navigate(['/my-event/past'])}
      if(tab=='draft'){this.router.navigate(['/my-event/draft'])}
      if(tab=='ongoing'){this.router.navigate(['/my-event/ongoing'])}
      if(tab=='upcoming'){this.router.navigate(['/my-event/upcoming'])}

      this.data.page.pageNumber = 0;
      this.onLoad(tab);
    }
    if(tab == 'dashboard')
    {
      if(tab=='dashboard'){this.router.navigate(['/my-event/dashboard'])}
      this.getregistrationChart();
      this.getrEarningChart();
      this.getickitSoldChart();
      this.actualAndExpected();
    }
  }

  public pickDate(): void {
    this.onDatePicked.emit();
    console.log("event");

}

getEvent(){
  this.router.navigate(['/my-event/ongoing']);
}

}
