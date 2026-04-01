import { TaxData } from './tax-data.interface';

export interface TaxDataResponse {
  data: TaxData[];
  total: number;
}
