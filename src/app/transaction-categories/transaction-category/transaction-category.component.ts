import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Models
import { TransactionCategory } from '../transaction-category';

// Services
import { TransactionCategoriesService } from '../transaction-categories.service';
import { LocationService } from '../../core/services/location.service';

@Component({
  moduleId: module.id,
  selector: 'transaction-category',
  templateUrl: './transaction-category.component.html',
  styleUrls: ['./transaction-category.component.css']
})
export class TransactionCategoryComponent implements OnInit {

  public transactionCategory: TransactionCategory;

  constructor(
    public transactionCategoriesService: TransactionCategoriesService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.transactionCategoriesService.get(params['id']).subscribe(
        transactionCategory => {
          this.transactionCategory = transactionCategory;
          this.locationService.setTitle('Transaction Category ' + transactionCategory.name);
        },
      );
    });
  }

  delete(transactionCategory: TransactionCategory) {
    this.transactionCategoriesService.delete(transactionCategory).subscribe(
      data => {
        this.locationService.back();
      }
    );
  }
}
