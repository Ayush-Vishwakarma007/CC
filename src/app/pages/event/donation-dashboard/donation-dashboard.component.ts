import {Component, OnInit, ViewChild} from '@angular/core';
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
  selector: 'app-donation-dashboard',
  templateUrl: './donation-dashboard.component.html',
  styleUrls: ['./donation-dashboard.component.scss']
})
export class DonationDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  eventDetail: any = [];
  reqData: any = [];
  donorList: any = [];
  topDonorList: any = [];
  authDetail: any = [];
  allDonors: any = [];
  eventId: any = '';
  status: boolean = false;
  totalDonorcollection: any;
  width = 0;

  constructor(private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.route.params.subscribe(params =>
      this.eventId = params['id']
    );
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
  }

  async ngOnInit() {
    this.donationChart();
    await this.getEventDetail();
    this.getDonors();
  }

  getEventDetail() {
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    this.spinner.show();
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.eventDetail = response['data'];
        resolve(null);
        this.spinner.hide();
      });
    });

  }

  getDonors() {
    this.reqData['filter']['donationType'] = 'DONATION';

    let req = {
      path: "event/sponsors",
      data: this.reqData,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      if (response['data']) {
        this.donorList = response['data'];
        response['data']['content'].map((item)=>{
          this.allDonors.push(item);
        });
      }
    });

    let reqData = this.reqData;
    reqData['sort']['orderBy'] = 'DESC';
    reqData['sort']['sortBy'] = 'TOTAL_PAYMENT';
    let req1 = {
      path: "event/sponsors",
      data: reqData,
      isAuth: true,
    };
    this.apiService.post(req1).subscribe(response => {
      if (response['data']) {
        this.topDonorList = response['data'];
      }
    });
    let req2 = {
      path: "event/sponsor/total/DONATION/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(req2).subscribe(response => {
      this.totalDonorcollection = 0;
      if (response['data']) {
        this.totalDonorcollection = response['data']['payment'];
        this.width = this.totalDonorcollection * 100 / this.eventDetail['eventConfigurations']['donationGoal'];
        if(this.width >100){
          this.width =100;
        }
      }
    });
  }

  donationChart() {
    let reqData = {
      'eventId': this.eventId,
      "donationType": 'DONATION',
      "successfulPayment": true
    };
    let request = {
      path: "event/sponsorPayment/DAY",
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

  onScroll() {
    this.reqData['filter']['donationType'] = 'DONATION';
    this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
    let req = {
      path: "event/sponsors",
      data: this.reqData,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      if (response['data']) {
        this.donorList = response['data'];
        response['data']['content'].map((item)=>{
          this.allDonors.push(item);
        });
      }
    });
  }
}
