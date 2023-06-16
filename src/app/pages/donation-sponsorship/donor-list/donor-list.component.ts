import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexMarkers,
  ApexStroke,
  ApexTheme,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from "ng-apexcharts";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {SpinnerService} from "../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {CommunityDetailsService} from "../../../services/community-details.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip,
  theme: ApexTheme
};
@Component({
  selector: 'app-donor-list',
  templateUrl: './donor-list.component.html',
  styleUrls: ['./donor-list.component.scss']
})
export class DonorListComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  eventDetail: any = [];
  reqData: any = [];
  donorList: any = [];
  topDonorList: any = [];
  authDetail: any = [];
  allDonors: any = [];
  topDonors: any = [];
  eventId: any = '';
  status: boolean = false;
  totalDonorcollection: any;
  width = 0;
  chapter : any;
  count : any;
  public communityDetail:any;
  public chapterList:any;


  constructor(private formBuilder: FormBuilder, public communityService:CommunityDetailsService, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {

    this.chapter = JSON.parse(localStorage.getItem('chapter'));
    if(this.router.url==="/"){
        this.communityDetail = this.communityService['communityDetail'];
        this.chapterList =this.communityService['chapterList'];
        this.chapter = this.chapterList[0];
        localStorage.setItem('chapter', JSON.stringify(this.chapter));
    }else{
      this.chapter = JSON.parse(localStorage.getItem('chapter'));
    }

    this.reqData = {
      "filter": {
        "donationType": "DONATION",
        "successfulPayment": true,
      },
      "page": {
        "pageLimit": 8,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE"
      }
    };
  }

  ngOnInit() {
    this.getdonorList();
    this.donationChart();
  }

  getdonorList() {
    this.reqData['filter']['chapterId'] = this.chapter['id'];

    let req = {
      path: 'event/chapter/sponsor/getAll',
      data: this.reqData,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.post(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.count = response['data'];
        this.allDonors = response['data']['content'];
      }
      this.spinner.hide();
    });

    let reqData = this.reqData;
    reqData['sort']['orderBy'] = 'DESC';
    reqData['sort']['sortBy'] = 'TOTAL_PAYMENT';
    let req1 = {
      path: 'event/chapter/sponsor/getAll',
      data: reqData,
      isAuth: true,
    };
    this.apiService.post(req1).subscribe(response => {
      if (response['data']) {
        this.topDonorList = response['data']['content'];
      }
    });
  }

  donationChart() {
    let reqData = {
      "donationType": 'DONATION',
      "chapterId": this.chapter['id'],
      "successfulPayment": true
    };
    let request = {
      path: "event/chapter/sponsorPayment/DAY",
      data: reqData,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      let dates = [];
      response['data'].forEach((val, index) => {
        dates.push({
          x: val.date,
          y: val.totalAmount, z: val.totalCount
        });
      });
      this.chartOptions = {
        series: [{
          name: "Total Collection ",
          data: dates,
        }],
        tooltip: {
          y: {
            formatter: function (y) {
              if (typeof y !== "undefined") {
                return "$ " + y.toFixed(0);
              }
              return y;
            }
          },
          shared: true,
          z: {
            formatter: undefined,
            title: 'No. of Contributors : '
          },
        },
        chart: {
          height: 350,
          type: "line",
          stacked: false,
          toolbar: {
            show : false,
        }
        },
        stroke: {
          width: 7,
          curve: "smooth"
        },
        xaxis: {
          type: "datetime",

        },

        title: {
          text: "Daily Donations",
          align: "left",
          style: {
            fontSize: "16px",
            color: "#666"
          }
        },

        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            gradientToColors: ["#FDD835"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          }
        },
        markers: {
          size: 4,
          colors: ["#FFA41B"],
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 6
          },
        },
        yaxis: {
          title: {
            text: "Engagement"
          }
        }
      };
      this.status = true;
    });
  }

  onScrollAllDonor() {

    this.reqData['filter']['chapterId'] = this.chapter['id'];
    this.reqData['filter']['donationType'] = 'DONATION';
    this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
    this.reqData['sort']['orderBy'] = 'DESC';
    this.reqData['sort']['sortBy'] = 'DATE';

    let req = {
      path: 'event/chapter/sponsor/getAll',
      data: this.reqData,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.donorList = response['data']['content'];
        this.donorList.map((item) =>{
          this.allDonors.push(item);
        })
      }
    });
  }

  onScrollTopDonor(){

    this.reqData['filter']['donationType'] = 'DONATION';
    this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
    this.reqData['filter']['chapterId'] = this.chapter['id'];
    this.reqData['sort']['orderBy'] = 'DESC';
    this.reqData['sort']['sortBy'] = 'TOTAL_PAYMENT';

    let req = {
      path: 'event/chapter/sponsor/getAll',
      data: this.reqData,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      if (response['data']) {
        this.topDonors = response['data']['content'];
        this.topDonors.map((item) =>{
          this.topDonorList.push(item);
        })
      }
    });
  }
}
