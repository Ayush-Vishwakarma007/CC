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
  ApexYAxis, ApexResponsive, ApexLegend, ApexPlotOptions
} from "ng-apexcharts";
import {Subject, Subscription} from "rxjs";

export type chapterChartOptions = {
  series: ApexAxisChartSeries;
  chapterChart: ApexChart;
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
export type newsletterChartOptions = {
  series: ApexAxisChartSeries;
  newsletterChart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  plotOptions: ApexPlotOptions,
  xaxis: ApexXAxis;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip,
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-newsletter-dashboard',
  templateUrl: './newsletter-dashboard.component.html',
  styleUrls: ['./newsletter-dashboard.component.scss']
})
export class NewsletterDashboardComponent implements OnInit {
  @ViewChild("chapterChart") chapterChart: ChartComponent;
  @ViewChild("newsletterChart") newsletterChart: ChartComponent;

  public newsletterChartOptions: Partial<newsletterChartOptions>;
  public chapterChartOptions: Partial<chapterChartOptions>;

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;


  @Input()
  chapterId = '';

  reqData: any = [];
  authDetail: any = [];
  status: boolean = false;
  width = 0;
  eventStatics: any = [];

  constructor(private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {
  }

  ngOnInit() {
    this.saveSubscription = this.save.subscribe(async () => {
      await this.donationChartData();
      await this.categoryData();
      this.status = true;
    });
  }

  donationChartData() {
    let request = {
      path: "notification/newsLetter/statics/chapter",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      let totalRemain = [];
      let totalViewd = [];
      let chapter = [];
      response['data'].forEach((val, index) => {
        chapter.push(val.chapterName);
        totalRemain.push(val.totalRemain);
        totalViewd.push(val.totalView);
      });
      this.chapterChartOptions = {
        series: [{
          name: "Viewed",
          data: totalViewd,
        },
          {
            name: "Not Viewed",
            data: totalRemain,
          }],
        chapterChart: {
          type: "bar",
          stacked: false,
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: "12px",
            colors: ["#fff"]
          }
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["#fff"]
        },
        xaxis: {
          categories: chapter
        },

        title: {
          text: "Chapter Wise Counts",
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
            text: "Engagement"
          }
        }
      };
      this.status = true;
    });


  }

  categoryData() {
    let request = {
      path: "notification/newsLetter/statics",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      let counts = [];
      let count = [];
      let labels = [];
      count['totalRemain']=[0]; count['totalView']=[0];
//,count['totalSent']
      if(response['data'])
      {
        count = response['data'];
        labels.push('Not Viewed', 'Viewed');
        counts.push(count['totalRemain'], count['totalView']);
      }


      this.newsletterChartOptions = {
        series: counts,
        labels: labels,
        newsletterChart: {
          width: 560,
          type: "donut"

        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex]
          }
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                total: {
                  show: true,
                  label: 'Total Sent',

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
        tooltip: {
          shared: true,
        },
        fill: {
          type: "gradient"
        },
        legend: {
          show: false,
          position: "bottom"
        },
        title: {
          text: "Newsletter Statistics",
          align: "left",
          style: {
            fontSize: "16px",
            color: "#666"
          }
        },
        xaxis: {
          type: 'category'
        },
        responsive: [
          {
            breakpoint: 880,
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
