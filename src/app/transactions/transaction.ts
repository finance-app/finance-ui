import { TransactionCategory } from '../transaction-categories/transaction-category';
import { Period } from '../periods/period';
import { Budget } from '../budgets/budget';

export interface Transaction {
  id: number;
  value: number;
  date: string;
  period: Period;
  budget: Budget;
  transaction_category: TransactionCategory;
  source: any;
  destination: any;
  type: string;
}
