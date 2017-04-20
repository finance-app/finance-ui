import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Models
import { Period } from '../period';

// Services
import { PeriodsService } from '../periods.service';
import { LocationService } from '../../core/services/location.service';
import { TimeframeService } from '../../core/services/timeframe.service';

import { Chart } from 'angular-highcharts';

@Component({
  moduleId: module.id,
  selector: 'period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css']
})
export class PeriodComponent implements OnInit {

  public period: Period;
  public chart: Chart;

  constructor(
    public periodsService: PeriodsService,
    public timeframeService: TimeframeService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.periodsService.get(params['id']).subscribe(
        period => {
          this.period = period;
          this.locationService.setTitle('Period ' + period.name);

          this.chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'Period balance over time'
            },
            xAxis: {
              categories: period.balance_history.labels,
            },
            series: period.balance_history.series,
          });
        },
      );
    });
  }

  delete(period: Period) {
    this.periodsService.delete(period).subscribe(
      data => {
        this.locationService.back();
      }
    );
  }
}
