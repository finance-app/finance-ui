import { Currency } from '../currencies';

export interface Account {
  id: number;
  name: string;
  comment: string;
  balance: number;
  current_balance: number;
  expenses_balance: number;
  incomes_balance: number;
  provider: string;
  type: string;
  currency: Currency;
  model_name: string;
}
