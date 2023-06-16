import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../../../services/api.service";
import {SpinnerService} from "../../../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent
} from "ng-apexcharts";
import {Subject, Subscription} from "rxjs";

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip,
  title: ApexTitleSubtitle;
};
export type  DonationChartOptions = {
  series: ApexAxisChartSeries;
  donationChart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip,
  title: ApexTitleSubtitle;
};
export type CircleChartOptions = {
  series: ApexNonAxisChartSeries;
  chartPer: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};
export type countsChartOptions = {
  series: ApexNonAxisChartSeries;
  countsChart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions,
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip,
  dataLabels: ApexDataLabels;
};
export type TicketsChartOptions = {
  series: ApexAxisChartSeries;
  ticketsChart:  ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  @ViewChild("donationChart") donationChart: ChartComponent;
  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chartPer") chartPer: ChartComponent;
  @ViewChild("countsChart") countsChart: ChartComponent;
  @ViewChild("ticketsChart") ticketsChart: ChartComponent;

  public lineChartOptions: Partial<LineChartOptions>;
  public circleChartOptions: Partial<CircleChartOptions>;
  public donationChartOptions: Partial<DonationChartOptions>;
  public countsChartOptions: Partial<countsChartOptions>;
  public TicketsChartOptions: Partial<TicketsChartOptions>;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  @Input()
  eventId = '';
  @Input()
  eventDetail: any = [];

  reqData: any = [];
  donorList: any = [];
  topDonorList: any = [];
  authDetail: any = [];
  status: boolean = false;
  totalDonorcollection: any;
  width = 0;
  eventStatics: any = [];
  allDonors: any = [];
  currentTab = 'donation';
  donationSubject: Subject<any> = new Subject();
  isShowDonateButton: boolean
  seatSelection:any
  constructor(private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
  }

 ngOnInit() {

    let data = []; data['tab'] = [];
    data['tab']['textLabel'] = 'donation';
    this.changeTab(data);

    this.isShowDonateButton = this.eventDetail['eventConfigurations']['allowDonor'];

    this.saveSubscription = this.save.subscribe(async () => {
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
      console.log(this.eventDetail['admin'],this.eventDetail['eventConfigurations']['allowDonorDisplayPublic'] )
      if (this.eventDetail['admin'] == false && this.eventDetail['eventConfigurations']['allowDonorDisplayPublic'] == true) {
        console.log('1')
        this.getDonors();
        await this.donationChartData();
      }
      else if(this.eventDetail['admin']==false && this.eventDetail['eventConfigurations']['allowDonorDisplayPublic']==false){
        this.TicketChart()
      }
       else {
        this.allDonors = [];
        this.eventChart();
        this.getDonors();
        await this.getEventStatics();
        await this.donationChartData();
        console.log('2')

        this.percentChart();



      }

      this.status = true;
    });

     this.TicketChart()
  }

  getEventStatics() {
    let data = {
      path: "event/eventStatics/" + this.eventId,
      isAuth: true
    };
    return new Promise((resolve) => {
      this.apiService.get(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventStatics = response['data'];
          this.totalCountsChart();
        }
        resolve(null);
      });
    });
  }

  eventChart() {
    let reqData = {
      'successfulPayment': true,
      'eventId': this.eventId
    };
    let request = {
      path: "event/paymentByEvent/DAY",
      data: reqData,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      let dates = [];
      response['data'].forEach((val, index) => {
        if (this.eventDetail['eventConfigurations']['freeEvent'] == true) {
          dates.push({
            x: val.date,
            z: val.totalAmount, y: val.totalCount
          });
        } else {
          dates.push({
            x: val.date,
            y: val.totalAmount, z: val.totalCount
          });
        }
      });

      this.lineChartOptions = {
        series: [{
          name: "Total Collection ",
          data: dates,
        }],
        chart: {
          height: 350,
          type: "line"
        },
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
            title: 'No. of Registration : '
          },
        },
        stroke: {
          width: 7,
          curve: "smooth"
        },
        xaxis: {
          type: "datetime",
          categories: dates
        },
        title: {
          text: "Daily Registrations & Collections",
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
            gradientToColors: ["#FDD835", "#FDD835"],
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
            size: 7
          }
        },
        yaxis: {
          title: {
            text: ""
          }
        }
      };
      if (this.eventDetail['eventConfigurations']['freeEvent'] == true) {
        this.lineChartOptions['series']= [{
          name: "No. Registration  ",
          data: dates,
        }];
        this.lineChartOptions['tooltip'] = {
          y: {
            formatter:undefined
          },
          shared: true,
          z: {
            formatter: function (z) {
              if (typeof z !== "undefined") {
                return " $ " + z.toFixed(0)
              }
              return z;
            },
            title: 'Total Collection :'
          },
        }
      }
    });

  }

  percentChart() {

    let data = 0;
    data = this.eventStatics['totalAttendees'] * 100 / this.eventDetail['eventCapacity'];

    this.circleChartOptions = {
      series: [data],
      chartPer: {
        height: 350,
        type: "radialBar",
        toolbar: {
          show: true
        }
      },
      title: {
        text: "Cumulative Registration",
        align: "left",
        style: {
          fontSize: "16px",
          color: "#666"
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: "70%",
            background: "#fff",
            image: undefined,
            position: "front",
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24
            }
          },
          track: {
            background: "#fff",
            strokeWidth: "67%",
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35
            }
          },

          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: "#888",
              fontSize: "17px"
            },
            value: {
              formatter: function (val) {
                return parseInt(val.toString(), 10).toString();
              },
              color: "#111",
              fontSize: "36px",
              show: true
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ["#ABE5A1"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ["Percent"]
    };
  }

  getDonors() {
    this.reqData['filter']['donationType'] = 'DONATION';
    console.log('donors');
    let req = {
      path: "event/sponsors",
      data: this.reqData,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      if (response['data']) {
        this.donorList = response['data'];
        response['data']['content'].map((item) => {
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
          this.width=100;
        }
      }
    });
  }

  donationChartData() {
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

      this.donationChartOptions = {
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
        donationChart: {
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
        response['data']['content'].map((item) => {
          this.allDonors.push(item);
        });
      }
    });
  }

  totalCountsChart() {
    let array = [];
    array['name'] = [];
    array['total'] = [];
    array['color'] = [];
    array['name'].push('Total Registration');
    array['total'].push(this.eventStatics['totalAttendees']);
    array['color'].push('#0863b5');

    array['name'].push('Total Collection ($)');
    array['total'].push(this.eventStatics['totalCollection']);
    array['color'].push('#fec600');

    array['name'].push('Total Donation ($)');
    array['total'].push(this.eventStatics['totalDonation']);
    array['color'].push('#7e245c');

    array['name'].push('Total Donors');
    array['total'].push(this.eventStatics['totalDonors']);
    array['color'].push('#e3001f');

    array['name'].push('Total Sponsorship ($)');
    array['total'].push(this.eventStatics['totalSponsorship']);
    array['color'].push('#b50938');

    array['name'].push('Total Sponsors');
    array['total'].push(this.eventStatics['totalSponsors']);
    array['color'].push('#e50064');


    array['name'].push('Total Vendor Amount ($)');
    array['total'].push(this.eventStatics['totalVendorAmount']);
    array['color'].push('#13a538');
    this.countsChartOptions = {
      series: array['total'],
      countsChart: {
        height: 390,
        type: "donut"
      },
      title: {
        text: "Event Statics",
        style: {
          fontSize: "16px",
          color: "#666"
        }
      },
      labels: array['name'],
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
        formatter: function(value, { seriesIndex, dataPointIndex, w }) {
          return value + ' - '+ w.config.series[seriesIndex]
        },
        showForZeroSeries: true,
        onItemClick: {
          toggleDataSeries: true
        },
        onItemHover: {
          highlightDataSeries: true
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              total: {
                show: false,
                label: 'Total Plan',

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
              width: 400
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  changeTab(data) {
    let tab = data.tab.textLabel;
    this.currentTab = tab;
    setTimeout(() => {
      if( this.currentTab  == 'donation' ||  this.currentTab  == 'sponsorship')
      {
        this.donationSubject.next(null);
      }
    }, 300);
  }
  TicketChart(){
    let request = {
      path: "event/eventRules/" + this.eventId,
      isAuth: true,
    };

      this.apiService.get(request).subscribe((response) => {
        this.seatSelection=response['data']
        let tickets:any = [];
        let array = [];
        tickets['name'] = [];
        tickets['available'] = [];
        tickets['unavailable'] = [];
        response['data'].forEach((data, index) => {
          this.seatSelection=data.allowSeatSelection
          //tickets['available'].push(data.capacity-data.registered)
          tickets['available'].push(data.allowedSeats)
          tickets['unavailable'].push(data.registered)
          tickets['name'].push(data.name)
        //   data.seatList.forEach(val => {
        //     console.log(val.bookSeats)

        // tickets['available'].push(val.totalSeats-val.bookSeats)
        // tickets['unavailable'].push(val.bookSeats)
        //   });


        });
      console.log(  tickets['unavailable'])
        this.TicketsChartOptions = {
          series: [
             {
                name: 'Unavailable',
                data: tickets['unavailable']
            },
            {
              name: 'Available',
              data: tickets['available']
          }
        ],
          ticketsChart:
           {
            type: "bar",
            height: 450,
            stacked: true,
            toolbar: {
              show: true
            }
          },
          plotOptions: {
            bar: {
              horizontal: false
            }
          },
          stroke: {
            width: 1,
            colors: ["#fff"]
          },
          title: {
            text: "Seat Selection Ticket"
          },
          xaxis: {
            categories:tickets['name'],

          },

          tooltip: {
            y: {
              // formatter: function(val) {
              //   return val;
              // }
            }
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: "top",
            horizontalAlign: "left",
            offsetX: 40
          }
        };
      });

  }

}
