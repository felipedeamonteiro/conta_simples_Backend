export default interface ICreateTransactionDTO {
  company_id: string;
  title: string;
  description?: string;
  credit_card_number?: number;
  currency: string;
  transaction_type: 'Credit' | 'Debit' | 'Income';
  date: Date;
  total_value: number;
  instalments?: number;
  instalment_value?: number;
}
