import { Currency } from '../currencies/currency';

export interface TransactionCategory {
  id: number;
  name: string;
  comment: string;
  transactions: number;
}
