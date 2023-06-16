import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../../../services/api.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {filter} from 'rxjs/operators';
import {Location} from '@angular/common';
import * as  Highcharts from 'highcharts';
import {HttpClient} from '@angular/common/http';
import * as Highchart from "highcharts/highmaps";
import Swal from 'sweetalert2';
import {SpinnerService} from '../../../../services/spinner.service';
import {ToastrService} from 'ngx-toastr';
import {EMAIL_PATTERN} from "../../../../helpers/validations";
import * as $ from 'jquery';
import {Subject, Subscription} from "rxjs";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent, ApexPlotOptions
} from "ng-apexcharts";

export type paymentChartOptions = {
  series: ApexAxisChartSeries;
  paymentChart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  colors: string[];
  grid: ApexGrid;
  fill: ApexFill;
  legend: ApexLegend,
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip,
  title: ApexTitleSubtitle;
};
export type memberChartOptions = {
  series: ApexAxisChartSeries;
  memberChart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  markers: ApexMarkers;
  legend: ApexLegend;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip,
  title: ApexTitleSubtitle;
};
export type revenueChartOptions = {
  series: ApexAxisChartSeries;
  revenueChart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  stroke: ApexStroke;
  tooltip: ApexTooltip,
  title: ApexTitleSubtitle;
};
export type diffChartOptions = {
  series: ApexAxisChartSeries;
  diffChart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions,
  tooltip: ApexTooltip,
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  @Input()
  userPermisssion: any = [];

  @Input()
  currentTab = '';

  @Input()
  chapterId = '';

  Highchart;
  fieldName: any;
  value: any;
  reqData: any = [];
  addMemberForm: FormGroup;
  submitBtn: boolean = true;
  editMemberForm: FormGroup;
  regChartData: any = [];
  chapterChartData: any = [];
  paymentChartData: any = [];
  notificationForm: FormGroup;

  MembershipChartActiveTab: any = 'DAY';
  paymentChartActiveTab: any = 'DAY';

  @ViewChild("mapChart", {read: ElementRef}) mapChart: ElementRef;

  @ViewChild("revenueChart") revenueChart: ChartComponent;
  @ViewChild("diffChart") diffChart: ChartComponent;
  @ViewChild("memberChart") memberChart: ChartComponent;
  @ViewChild("paymentChart") paymentChart: ChartComponent;

  public memberChartOptions: Partial<memberChartOptions>;
  public revenueChartOptions: Partial<revenueChartOptions>;
  public diffChartOptions: Partial<diffChartOptions>;
  public paymentChartOptions: Partial<paymentChartOptions>;

  constructor(public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {
    this.reqData = {
      "filter": {
        "roles": [
          "USER"
        ],

        "approved": true,
        "mainUser": true,
        "search": ""
      },
      "page": {
        "limit": 8,
        "page": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };
    this.addMemberForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    });
    this.notificationForm = this.formBuilder.group({
      message: ['', Validators.required],
      subject: ['', Validators.required],
    });
    this.editMemberForm = this.formBuilder.group({});
    this.getPermission();
  }

  ngOnInit() {

    this.saveSubscription = this.save.subscribe(() => {
      this.mapChartData();
      this.paymentCharts();
      this.registerNonRegsiterChart();
      this.membershipChart();
      this.chapterChart();
    });
  }

  mapChartData() {

    let reqData = {};
    reqData['mainMember'] = true;
    let data;
    let req0 = {
      path: "auth/dashboard/memberCount/chapter",
      data: reqData,
      isAuth: true,
    };
    this.apiService.post(req0).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        let data = [];
        response['data'].forEach((item, index) => {
          if (item.mapReference != '' && item.mapReference != null) {
            data[index] = [item.mapReference, item.count];
          }
        });

        this.Highchart = Highchart;
        let req = {
          path: 'https://code.highcharts.com/mapdata/countries/us/us-all.geo.json'
        };
        this.apiService.getUrl(req).subscribe(response => {
          // Initiate the chart
          this.Highchart.mapChart(this.mapChart.nativeElement, {
            chart: {
              map: response
            },
            title: {
              text: 'Map For Registered Members'
            },
            mapNavigation: {
              enabled: true,
              buttonOptions: {
                verticalAlign: 'bottom'
              }
            },
            credits: {
              enabled: false
            },
            colorAxis: {
              min: 0
            },
            series: [{
              data: data,
              name: 'Members',
              states: {
                hover: {
                  color: '#07b3a1'
                }
              },
              dataLabels: {
                enabled: true,
                format: '{point.name}'
              }
            }]
          });
        });
      }
    });

  }

  msChartClick(status) {
    this.MembershipChartActiveTab = status;
    this.membershipChart();
  }

  membershipChart() {
    let reqData = {};

    let request = {
      path: "auth/dashboard/registrationCount/" + this.MembershipChartActiveTab,
      data: reqData,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.regChartData = [];
        this.regChartData['date'] = [];
        this.regChartData['count'] = [];
        response['data'].forEach((val, index) => {
          this.regChartData['date'].push(val.date);
          this.regChartData['count'].push(val.totalRegistration);
        });
        this.memberChartOptions = {
          series: [{
            name: "Total Members ",
            data: this.regChartData['count'],
          }],
          memberChart: {
            type: "bar",
            stacked: false,
          },
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#000"]
            }
          },
          legend: {
            show: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["#fff"]
          },
          xaxis: {
            categories: this.regChartData['date']
          },

          title: {
            text: "",
            align: "left",
            style: {
              fontSize: "16px",
              color: "#666"
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
              text: "Count"
            }
          }
        };
      }
    });
  }

  pChartClick(status) {
    this.paymentChartActiveTab = status;
    this.paymentCharts();
  }

  paymentCharts() {
    let reqData = {};

    let request = {
      path: "auth/dashboard/payment/" + this.paymentChartActiveTab,
      data: reqData,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.paymentChartData = [];
        this.paymentChartData['date'] = [];
        this.paymentChartData['count'] = [];
        response['data'].forEach((val, index) => {
          this.paymentChartData['date'].push(val.date);
          this.paymentChartData['count'].push(val.totalAmount);
        });
        this.paymentChartOptions = {
          series: [{
            name: "Total Payment ",
            data: this.paymentChartData['count'],
          }],
          paymentChart: {
            type: "bar",
            stacked: true,
          },
          dataLabels: {
            enabled: true,
            offsetY: -30,
            formatter: function (val, opt) {
              return  "$ " + val
            },
            style: {
              fontSize: "12px",
              colors: ["#000"]
            }
          },

          stroke: {
            show: true,
            width: 2,
          },
          xaxis: {
            categories: this.paymentChartData['date'],
          },
          colors: [
            "#008FFB",
            "#00E396",
            "#FEB019",
            "#FF4560",
            "#775DD0",
            "#546E7A",
            "#26a69a",
            "#D10CE8"
          ],
          plotOptions: {
            bar: {
              columnWidth: "45%",
              distributed: true,
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            }
          },
          legend: {
            show: false
          },
          title: {
            text: "",
            align: "left",
            style: {
              fontSize: "16px",
              color: "#666"
            }
          },
          markers: {
            size: 4,
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
              size: 6
            },
          },
          yaxis: {
            title: {
              text: "Count"
            }
          }
        };
      }
    });
  }

  registerNonRegsiterChart() {

    let request = {
      path: "auth/dashboard/registrationInsight",
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        let chartData = [];
        chartData['label'] = [];
        chartData['count'] = [];
        let totalMember = 0;
        response['data'].forEach((item, index) => {
          let status = 'Non Registerd Member';
          if (item.status != null) {
            status = item.status;
          }
          chartData['label'].push(status);
          chartData['count'].push(item.totalRegistered);
          totalMember = totalMember + item.totalRegistered;
        });

        this.diffChartOptions = {
          series: chartData['count'],
          labels: chartData['label'],
          diffChart: {
            width: 500,
            type: "donut"
          },
          dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
              return opt.w.globals.labels[opt.dataPointIndex]
            }
          },
          tooltip: {
            shared: true,
          },
          fill: {
            type: "gradient"
          },
          legend: {
            formatter: function (value, { seriesIndex, dataPointIndex, w }) {
              return value + ' - <b>' + w.config.series[seriesIndex] + '</b>'
            },
            position: "right",
            //show:false,
            showForZeroSeries: true,
            onItemClick: {
              toggleDataSeries: true
            },
            onItemHover: {
              highlightDataSeries: true
            },
          },
          title: {
            text: "",
            align: "left",
            style: {
              fontSize: "16px",
              color: "#666"
            }
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  total: {
                    show: true,
                    label: 'Total Members',

                  },
                  show: true,
                  name: {
                    show: true
                  },
                  value: {
                    show: true
                  }
                }
              }
            }
          },
          xaxis: {
            type: 'category'
          },
          responsive: [
            {
              breakpoint: 991,
              options: {
                chart: {
                  width: 380
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
      }
      this.spinner.hide();
    });
  }

  chapterChart() {
    let reqData = {};
    reqData['mainMember'] =true;
    let req = {
      path: "auth/dashboard/memberCount/chapter",
      data: reqData,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      //console.log(response);
      if (response['status']['code'] == 'OK') {
        this.chapterChartData = [];
        this.chapterChartData['name'] = [];
        this.chapterChartData['count'] = [];
        response['data'].forEach((val, index) => {
          this.chapterChartData['name'].push(val.name);
          this.chapterChartData['count'].push(val.count);
        });
        console.log(this.chapterChartData);
        this.revenueChartOptions = {
          series: [{
            name: "Total Members ",
            data: this.chapterChartData['count'],
          }],
          revenueChart: {
            type: "bar",
            stacked: false,
          },
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: '12px',
              colors: ["#304758"]
            }
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: 'top', // top, center, bottom
              },
              columnWidth: "80%",
              distributed: true
            }
          },
          legend: {
            show: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["#fff"]
          },
          xaxis: {
            categories: this.chapterChartData['name']
          },

          title: {
            text: "",
            align: "left",
            style: {
              fontSize: "16px",
              color: "#666"
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
              text: "Count"
            }
          }
        };
      }
    });
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
}
