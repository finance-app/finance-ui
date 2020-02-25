import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Models
import { Budget } from '../budget';

// Services
import { BudgetsService } from '../budgets.service';
import { LocationService } from '../../core/services/location.service';
import { TimeframeService } from '../../core/services/timeframe.service';

@Component({
  selector: 'budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

  public budget: Budget;

  constructor(
    public budgetsService: BudgetsService,
    public timeframeService: TimeframeService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.budgetsService.get(params['id']).subscribe(
        budget => {
          this.budget = budget;
          this.locationService.setTitle('Budget ' + budget.name);
        },
      );
    });
  }

  delete(budget: Budget) {
    this.budgetsService.delete(budget).subscribe(
      data => {
        this.locationService.back();
      }
    );
  }
}
