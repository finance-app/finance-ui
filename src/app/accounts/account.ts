import { Currency } from '../currencies';

export interface Account {
  id: number;
  name: string;
  comment: string;
  balance: number;
  provider: string;
  type: string;
  currency_id: number;
  currency: Currency;
}
