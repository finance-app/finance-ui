import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Models
import { Transaction } from '../transaction';

// Services
import { TransactionsService } from '../transactions.service';
import { LocationService } from '../../core/services/location.service';

@Component({
  moduleId: module.id,
  selector: 'transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  public transaction: Transaction;

  constructor(
    public transactionsService: TransactionsService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.transactionsService.get(params['id']).subscribe(
        transaction => {
          this.transaction = transaction;
          this.locationService.setTitle('Transaction ' + transaction.name);
        },
      );
    });
  }

  delete(transaction: Transaction) {
    this.transactionsService.delete(transaction).subscribe(
      data => {
        this.locationService.back();
      }
    );
  }
}
