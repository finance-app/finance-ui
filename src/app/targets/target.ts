import { TransactionCategory } from '../transaction-categories/transaction-category';

export interface Target {
  id: number;
  name: string;
  comment: string;
  default_income_transaction_category_id: number;
  default_income_transaction_category: TransactionCategory;
  default_expense_transaction_category_id: number;
  default_expense_transaction_category: TransactionCategory;
  incomes: number;
  expenses: number;
  balance: number;
  favourite: boolean;
}
