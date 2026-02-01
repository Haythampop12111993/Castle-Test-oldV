import { Component, OnInit } from '@angular/core';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-marketing-reports',
  templateUrl: './marketing-reports.component.html',
  styleUrls: ['./marketing-reports.component.css']
})
export class MarketingReportsComponent implements OnInit {

  lineChartsData: {
    salesActivity: ChartDataSets[];
    monthlySales: ChartDataSets[];
  } = {
    salesActivity: [],
    monthlySales: []
  };

  lineChartsLabels = {
    salesActivity: [],
    monthlySales: []
  };

  lineChartsOptions: {
    salesActivity: ChartOptions;
    monthlySales: ChartOptions;
  } = {
    salesActivity: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          fill: false,
          tension: 0
        }
      }
    },
    monthlySales: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          fill: false
        }
      }
    }
  };

  lineChartsColors: { salesActivity: Color[]; monthlySales: Color[] } = {
    salesActivity: [
      {
        backgroundColor: '#786fa6',
        borderColor: '#786fa6',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#786fa6',
        pointHoverBackgroundColor: '#786fa6',
        pointHoverBorderColor: '#fff'
      },
      {
        backgroundColor: '#f8a5c2',
        borderColor: '#f8a5c2',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#f8a5c2',
        pointHoverBackgroundColor: '#f8a5c2',
        pointHoverBorderColor: '#fff'
      },
      {
        backgroundColor: '#63cdda',
        borderColor: '#63cdda',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#63cdda',
        pointHoverBackgroundColor: '#63cdda',
        pointHoverBorderColor: '#fff'
      },
      {
        backgroundColor: '#ea8685',
        borderColor: '#ea8685',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#ea8685',
        pointHoverBackgroundColor: '#ea8685',
        pointHoverBorderColor: '#fff'
      },
      {
        backgroundColor: '#596275',
        borderColor: '#596275',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#596275',
        pointHoverBackgroundColor: '#596275',
        pointHoverBorderColor: '#fff'
      },
      {
        backgroundColor: '#546de5',
        borderColor: '#546de5',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#546de5',
        pointHoverBackgroundColor: '#546de5',
        pointHoverBorderColor: '#fff'
      },
      {
        backgroundColor: '#f19066',
        borderColor: '#f19066',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#f19066',
        pointHoverBackgroundColor: '#f19066',
        pointHoverBorderColor: '#fff'
      }
    ],
    monthlySales: [
      {
        backgroundColor: '#78e08f',
        borderColor: '#78e08f',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#78e08f',
        pointHoverBackgroundColor: '#78e08f',
        pointHoverBorderColor: '#fff'
      },
      {
        backgroundColor: '#3c6382',
        borderColor: '#3c6382',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#3c6382',
        pointHoverBackgroundColor: '#3c6382',
        pointHoverBorderColor: '#fff'
      },
      {
        backgroundColor: '#1e3799',
        borderColor: '#1e3799',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#1e3799',
        pointHoverBackgroundColor: '#1e3799',
        pointHoverBorderColor: '#fff'
      }
    ]
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http
      .get(`${environment.api_base_url}dashboard/charts/sales_activity`)
      .subscribe(
        (data: any) => {
          this.lineChartsLabels.salesActivity = [...data.months];
          this.lineChartsData.salesActivity = [...data.results];
          console.log(this.lineChartsData.salesActivity);
        },
        err => {
          console.log(err);
        }
      );
  }

}
