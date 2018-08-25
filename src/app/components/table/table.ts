import { take } from 'rxjs/operators';

export class Table {

  public path: string;
  public objects: any;
  public objectsService: any;
  public balances_rows = [
    {
      title: 'Incomes',
      value: this.incomesValue.bind(this),
      ngClass: this.incomesNgClass.bind(this),
      visible: function(object) { return object.incomes_balance !== undefined && object.incomes_balance != object.balance; },
    },
    {
      title: 'Expenses',
      value: this.expensesValue.bind(this),
      ngClass: this.expensesNgClass.bind(this),
      visible: function(object) { return object.expenses_balance !== undefined && object.expenses_balance != object.balance; },
    },
    {
      title: 'Balance',
      value: this.balanceValue.bind(this),
      ngClass: this.balanceNgClass.bind(this),
      visible: function(object) { return object.balance !== undefined && object.balance !== "0.0" },
    },
  ];

  public name_row = {
    title: 'Name',
    routerLink: function(object) { return [this.path, object.id] }.bind(this),
  };

  public comment_row = {
    title: 'Comment',
  }

  constructor() {}

  incomesValue(object) {
    return object.incomes_balance > 0 ? '+' + object.incomes_balance : '0.0';
  }

  expensesValue(object) {
    return object.expenses_balance ? object.expenses_balance : '0.0';
  }

  balanceValue(object) {
    return object.balance ? (object.balance > 0 ? '+' + object.balance : object.balance) : '0.0';
  }

  incomesNgClass(object) {
    return {'text-success': object.incomes_balance > 0};
  }

  expensesNgClass(object) {
    return {'text-danger': object.expenses_balance < 0};
  }

  balanceNgClass(object) {
    return {'text-success': object.balance > 0, 'text-danger': object.balance < 0};
  }

  delete(object) {
    this.objectsService.delete(object).subscribe(
      data => {
        this.objects.pipe(take(1)).subscribe(
          objects => {
            const index: number = objects.indexOf(object, 0);
            if (index != -1) {
              objects.splice(index, 1);
              this.objects.next(objects);
            }
          }
        );
      }
    );
  }
}
