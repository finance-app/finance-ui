import { Budget } from '../budgets/budget';
import { Currency } from '../currencies/currency';

export interface Period {
  id: number;
  name: string;
  comment: string;
  start_date: string;
  end_date: string;
  budget_id: number;
  budget: Budget;
  incomes_balance: number;
  expenses_balance: number;
  balance: number;
  transactions: number;
  currency: Currency;
}
