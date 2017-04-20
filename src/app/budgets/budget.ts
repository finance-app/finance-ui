import { Currency } from '../currencies/currency';
import { Account } from '../accounts/account';

export interface Budget {
  id: number;
  name: string;
  comment: string;
  currency_id: number;
  currency: Currency;
  default_account_id: number;
  default_account: Account;
  incomes_balance: number;
  expenses_balance: number;
  balance: number;
}
