import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../../services/api.service";
import {SpinnerService} from "../../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexTooltip,
  ApexYAxis, ApexResponsive, ApexLegend,ApexPlotOptions
} from "ng-apexcharts";
import {Subject, Subscription} from "rxjs";

export type DonationChartOptions = {
  series: ApexAxisChartSeries;
  donationChart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip:ApexTooltip,
  title: ApexTitleSubtitle;
};
export type pieChartOptions = {
  series: ApexAxisChartSeries;
  sponsorCategoryChart: ApexChart;
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

@Component({
  selector: 'app-ch-dashboard',
  templateUrl: './ch-dashboard.component.html',
  styleUrls: ['./ch-dashboard.component.scss']
})
export class ChDashboardComponent implements OnInit {
  @ViewChild("donationChart") donationChart: ChartComponent;
  @ViewChild("sponsorCategoryChart") sponsorCategoryChart: ChartComponent;

  public donationChartOptions: Partial<DonationChartOptions>;
  public pieChartOptions: Partial<pieChartOptions>;

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  @Input()
  eventId = '';

  @Input()
  chapterId = '';

  reqData: any = [];
  authDetail: any = [];
  status: boolean = false;
  width = 0;
  eventStatics: any = [];
  constructor(private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {
  }

  async ngOnInit() {
  /*  await this.donationChartData();
    await this.categoryData();*/
    this.saveSubscription = this.save.subscribe(async () => {
      await this.donationChartData();
      await this.categoryData();

      this.status = true;
    });

  }

  donationChartData() {
    let reqData = {
      'chapterId': this.chapterId,
      "donationType": 'DONATION',
     // "successfulPayment": true
    };
    let request = {
      path: "event/chapter/sponsorPayment/DAY",
      data: reqData,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      let dates = [];
      response['data'].forEach((val, index) => {
        dates.push({ x: val.date ,
          y: val.totalAmount,z:val.totalCount
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
                return "$ " +y.toFixed(0);
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
  categoryData() {
    let reqData = {
      'chapterId': this.chapterId,
      "donationType": 'DONATION',
      "successfulPayment": true
    };
    let request = {
      path: "event/chapter/sponsorCategory/statics",
      data: reqData,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      let data = [];
      let labels = [];
      response['data'].forEach((val, index) => {
        labels.push(val.name);
        data.push(val.totalCount);
      });
      this.pieChartOptions = {
        series:data,
        labels: labels,
        sponsorCategoryChart: {
          width: 560,
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
          formatter: function(value, { seriesIndex, dataPointIndex, w }) {
            return w.config.series[seriesIndex].name
          },
          showForZeroSeries: true,
          onItemClick: {
            toggleDataSeries: true
          },
          onItemHover: {
            highlightDataSeries: true
          },
        },
        title: {
          text: "Donation Category",
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
                  label: 'Total Category',

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
            breakpoint: 1600,
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
    });


  }


}
