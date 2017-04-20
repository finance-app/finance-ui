import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Models
import { Account } from '../account';

// Services
import { AccountsService } from '../accounts.service';
import { LocationService } from '../../core/services/location.service';

@Component({
  moduleId: module.id,
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public account: Account;

  constructor(
    public accountsService: AccountsService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.accountsService.get(params['id']).subscribe(
        account => {
          this.account = account;
          this.locationService.setTitle('Account ' + account.name);
        },
      );
    });
  }

  delete(account: Account) {
    this.accountsService.delete(account).subscribe(
      data => {
        this.locationService.back();
      }
    );
  }
}
